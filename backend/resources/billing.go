package resources

import (
	"encoding/json"
	"errors"
	"io"
	"platform/backend/config"
	"platform/backend/models"
	"platform/backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v81"
	"gorm.io/gorm"
)

var stripeService *utils.StripeService

func init() {
	stripeService = utils.NewStripeService()
}

func CreateCheckoutSession(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		user := utils.Try(utils.ByID[models.User](userID))

		var req struct {
			PlanName        string `json:"planName" binding:"required"`
			BillingInterval string `json:"billingInterval" binding:"required"`
			OrganizationID  string `json:"organizationId" binding:"required"`
		}

		utils.TryErr(c.ShouldBindJSON(&req))

		// Validate plan exists and is not free
		plan, err := utils.Where[models.Plan]("name", req.PlanName)
		if err != nil || !plan.IsActive {
			utils.Respond(c, utils.StatusBadRequest, "Invalid plan selected", nil)
			return
		}

		if plan.MonthlyPrice == 0 && plan.YearlyPrice == 0 {
			utils.Respond(c, utils.StatusBadRequest, "Free plan does not require checkout", nil)
			return
		}

		// Check organization ownership
		orgID := utils.Try(uuid.Parse(req.OrganizationID))
		utils.Check(utils.CheckOwnership(orgID, userID))

		// Create checkout session
		successURL := c.Request.Header.Get("Origin") + "/billing/success?session_id={CHECKOUT_SESSION_ID}"
		cancelURL := c.Request.Header.Get("Origin") + "/billing"

		session := utils.Try(stripeService.CreateCheckoutSession(
			user.Email,
			req.PlanName,
			req.BillingInterval,
			successURL,
			cancelURL,
			map[string]string{
				"user_id":         user.ID.String(),
				"organization_id": req.OrganizationID,
				"plan_name":       req.PlanName,
				"billing_period":  req.BillingInterval,
			},
		))

		utils.Respond(c, utils.StatusOK, "Checkout session created", gin.H{
			"sessionId":  session.ID,
			"sessionUrl": session.URL,
		})
	})
}

func HandleStripeWebhook(c *gin.Context) {
	utils.H(c, func() {
		payload := utils.Try(io.ReadAll(c.Request.Body))
		signature := c.GetHeader("Stripe-Signature")

		event := utils.Try(stripeService.ConstructWebhookEvent(payload, signature))

		// Handle different event types
		switch event.Type {
		case "checkout.session.completed":
			handleCheckoutCompleted(event)
		case "customer.subscription.updated":
			handleSubscriptionUpdated(event)
		case "customer.subscription.deleted":
			handleSubscriptionDeleted(event)
		case "invoice.payment_succeeded":
			handlePaymentSucceeded(event)
		case "invoice.payment_failed":
			handlePaymentFailed(event)
		}

		utils.Respond(c, utils.StatusOK, "Webhook received", nil)
	})
}

func handleCheckoutCompleted(event stripe.Event) {
	var session stripe.CheckoutSession
	if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
		return
	}

	metadata := session.Metadata
	if metadata == nil {
		return
	}

	orgID, err := uuid.Parse(metadata["organization_id"])
	if err != nil {
		return
	}

	planName := metadata["plan_name"]
	billingPeriod := metadata["billing_period"]

	billingService := &utils.BillingService{}
	subscription, err := billingService.CreateSubscription(orgID, planName, billingPeriod)
	if err != nil {
		return
	}

	subscription.StripeSubscriptionID = session.Subscription.ID
	subscription.StripeCustomerID = session.Customer.ID

	utils.Create(subscription)
}

func handleSubscriptionUpdated(event stripe.Event) {
	var sub stripe.Subscription
	if err := json.Unmarshal(event.Data.Raw, &sub); err != nil {
		return
	}

	dbSub, err := utils.Where[models.Subscription]("stripe_subscription_id", sub.ID)
	if err != nil {
		return
	}

	dbSub.Status = string(sub.Status)
	if sub.CurrentPeriodEnd > 0 {
		dbSub.EndDate = time.Unix(sub.CurrentPeriodEnd, 0)
	}

	utils.Save(&dbSub)
}

func handleSubscriptionDeleted(event stripe.Event) {
	var sub stripe.Subscription
	if err := json.Unmarshal(event.Data.Raw, &sub); err != nil {
		return
	}

	dbSub, err := utils.Where[models.Subscription]("stripe_subscription_id", sub.ID)
	if err != nil {
		return
	}

	dbSub.Status = config.StatusCancelled
	utils.Save(&dbSub)
}

func handlePaymentSucceeded(event stripe.Event) {
	var invoice stripe.Invoice
	if err := json.Unmarshal(event.Data.Raw, &invoice); err != nil {
		return
	}

	if invoice.Subscription == nil {
		return
	}

	dbSub, err := utils.Where[models.Subscription]("stripe_subscription_id", invoice.Subscription.ID)
	if err != nil {
		return
	}

	dbSub.Status = config.StatusActive
	if invoice.PeriodEnd > 0 {
		dbSub.EndDate = time.Unix(invoice.PeriodEnd, 0)
	}

	utils.Save(&dbSub)
}

func handlePaymentFailed(event stripe.Event) {
	var invoice stripe.Invoice
	if err := json.Unmarshal(event.Data.Raw, &invoice); err != nil {
		return
	}

	if invoice.Subscription == nil {
		return
	}

	dbSub, err := utils.Where[models.Subscription]("stripe_subscription_id", invoice.Subscription.ID)
	if err != nil {
		return
	}

	dbSub.Status = "past_due"
	utils.Save(&dbSub)

	user := utils.Try(utils.GetOrgOwner(dbSub.OrganizationID))
	if user.Email != "" {
		utils.SendPaymentFailedEmail(user.Email, dbSub.PlanName)
	}
}

func CancelSubscription(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		subscriptionID := c.Param("id")

		subID := utils.Try(uuid.Parse(subscriptionID))
		sub := utils.Try(utils.ByID[models.Subscription](subID))

		utils.Check(utils.CheckOwnership(sub.OrganizationID, userID))

		if sub.StripeSubscriptionID != "" {
			_, err := stripeService.CancelSubscription(sub.StripeSubscriptionID)
			if err != nil {
				utils.Respond(c, utils.StatusBadRequest, "Failed to cancel subscription in Stripe", nil)
				return
			}
		}

		sub.Status = config.StatusCancelled
		utils.TryErr(utils.HandleCRUD(c, "update", &sub, "subscription"))

		utils.CrudSuccess(c, "update", "subscription", sub)
	})
}

// GetSubscriptionStatus gets the current subscription status
func GetSubscriptionStatus(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		organizationID := c.Query("organizationId")

		if organizationID == "" {
			utils.Respond(c, utils.StatusBadRequest, "Organization ID is required", nil)
			return
		}

		orgID := utils.Try(uuid.Parse(organizationID))
		utils.Check(utils.CheckOwnership(orgID, userID))

		sub, err := utils.Where[models.Subscription]("organization_id", orgID)
		
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			utils.Respond(c, 500, "Failed to query subscription", nil)
			return
		}
		
		if errors.Is(err, gorm.ErrRecordNotFound) {
			freePlan := utils.FirstOrNil[models.Plan](map[string]any{
				"monthly_price": 0,
				"yearly_price":  0,
				"is_active":     true,
			})
			
			if freePlan != nil {
				utils.Respond(c, utils.StatusOK, "", gin.H{
					"plan":          freePlan.Name,
					"status":        config.StatusActive,
					"billingPeriod": config.BillingMonthly,
				})
			} else {
				utils.Respond(c, utils.StatusOK, "", gin.H{
					"plan":          "none",
					"status":        "inactive",
					"billingPeriod": config.BillingMonthly,
				})
			}
			return
		}

		billingService := &utils.BillingService{}
		
		utils.Respond(c, utils.StatusOK, "", gin.H{
			"plan":          sub.PlanName,
			"status":        billingService.GetSubscriptionStatus(&sub),
			"billingPeriod": sub.BillingPeriod,
			"startDate":     sub.StartDate,
			"endDate":       sub.EndDate,
			"stripeCustomerId": sub.StripeCustomerID,
		})
	})
}

func GetCustomerPortal(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		organizationID := c.Query("organizationId")

		if organizationID == "" {
			utils.Respond(c, utils.StatusBadRequest, "Organization ID is required", nil)
			return
		}

		orgID := utils.Try(uuid.Parse(organizationID))
		utils.Check(utils.CheckOwnership(orgID, userID))

		sub, err := utils.Where[models.Subscription]("organization_id", orgID)
		
		if err != nil || sub.StripeCustomerID == "" {
			utils.Respond(c, utils.StatusBadRequest, "No active subscription found", nil)
			return
		}

		returnURL := c.Request.Header.Get("Origin") + "/billing"
		portalURL := utils.Try(stripeService.CreatePortalSession(sub.StripeCustomerID, returnURL))

		utils.Respond(c, utils.StatusOK, "", gin.H{
			"url": portalURL,
		})
	})
}


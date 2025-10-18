package resources

import (
	"errors"
	"io"
	"platform/backend/config"
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var stripeService *utils.StripeService

func init() {
	stripeService = utils.NewStripeService()
}

// CreateCheckoutSession creates a Stripe checkout session for subscription
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

		// Validate plan
		if req.PlanName == config.PlanFree {
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

// HandleStripeWebhook handles Stripe webhook events
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

// Helper functions for webhook handlers
func handleCheckoutCompleted(event interface{}) {
	// TODO: Update subscription in database
	// Extract metadata and create/update subscription record
}

func handleSubscriptionUpdated(event interface{}) {
	// TODO: Update subscription status in database
}

func handleSubscriptionDeleted(event interface{}) {
	// TODO: Mark subscription as cancelled in database
}

func handlePaymentSucceeded(event interface{}) {
	// TODO: Record successful payment
}

func handlePaymentFailed(event interface{}) {
	// TODO: Handle failed payment, notify user
}

// CancelSubscription cancels a user's subscription
func CancelSubscription(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		subscriptionID := c.Param("id")

	// Get subscription from database
	subID := utils.Try(uuid.Parse(subscriptionID))
	sub := utils.Try(utils.ByID[models.Subscription](subID))

		// Check ownership through organization
		utils.Check(utils.CheckOwnership(sub.OrganizationID, userID))

		// Cancel in Stripe (if it has a Stripe subscription ID)
		// For now, just update status in database
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

	// Get active subscription for organization
	var sub models.Subscription
	err := db.DB.Where("organization_id = ?", orgID).First(&sub).Error
	
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		utils.Respond(c, 500, "Failed to query subscription", nil)
		return
	}
	
	if errors.Is(err, gorm.ErrRecordNotFound) {
			// No subscription found, return free plan
			utils.Respond(c, utils.StatusOK, "", gin.H{
				"plan":          config.PlanFree,
				"status":        config.StatusActive,
				"billingPeriod": config.BillingMonthly,
			})
			return
		}

		billingService := &utils.BillingService{}
		
		utils.Respond(c, utils.StatusOK, "", gin.H{
			"plan":          sub.PlanName,
			"status":        billingService.GetSubscriptionStatus(&sub),
			"billingPeriod": sub.BillingPeriod,
			"startDate":     sub.StartDate,
			"endDate":       sub.EndDate,
		})
	})
}


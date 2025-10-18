package utils

import (
	"errors"
	"os"
	"platform/backend/config"
	"platform/backend/db"
	"platform/backend/models"

	"github.com/stripe/stripe-go/v81"
	portalSession "github.com/stripe/stripe-go/v81/billingportal/session"
	"github.com/stripe/stripe-go/v81/checkout/session"
	"github.com/stripe/stripe-go/v81/customer"
	"github.com/stripe/stripe-go/v81/subscription"
	"github.com/stripe/stripe-go/v81/webhook"
)

// StripeService provides DRY methods for Stripe operations
type StripeService struct {
	SecretKey     string
	WebhookSecret string
}

// NewStripeService creates a new Stripe service instance
func NewStripeService() *StripeService {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
	
	return &StripeService{
		SecretKey:     os.Getenv("STRIPE_SECRET_KEY"),
		WebhookSecret: os.Getenv("STRIPE_WEBHOOK_SECRET"),
	}
}

// CreateCustomer creates a Stripe customer with DRY logic
func (ss *StripeService) CreateCustomer(email string, name string, metadata map[string]string) (*stripe.Customer, error) {
	if email == "" {
		return nil, errors.New("email is required")
	}

	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Name:  stripe.String(name),
	}

	if metadata != nil {
		params.Metadata = metadata
	}

	return customer.New(params)
}

// CreateCheckoutSession creates a Stripe checkout session for subscription
func (ss *StripeService) CreateCheckoutSession(
	customerEmail string,
	planName string,
	billingInterval string,
	successURL string,
	cancelURL string,
	metadata map[string]string,
) (*stripe.CheckoutSession, error) {
	// Get price ID
	priceID, err := ss.GetPriceID(planName, billingInterval)
	if err != nil {
		return nil, err
	}

	params := &stripe.CheckoutSessionParams{
		CustomerEmail: stripe.String(customerEmail),
		Mode:          stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
	}

	if metadata != nil {
		params.Metadata = metadata
	}

	return session.New(params)
}

// GetPriceID retrieves the Stripe price ID for a plan and interval
func (ss *StripeService) GetPriceID(planName string, interval string) (string, error) {
	var plan models.Plan
	err := db.DB.Where("name = ? AND is_active = ?", planName, true).First(&plan).Error
	if err != nil {
		return "", errors.New("plan not found or inactive")
	}

	if interval == config.BillingYearly {
		if plan.StripePriceIDYearly == "" {
			return "", errors.New("yearly price ID not configured for this plan")
		}
		return plan.StripePriceIDYearly, nil
	}

	if plan.StripePriceIDMonthly == "" {
		return "", errors.New("monthly price ID not configured for this plan")
	}
	return plan.StripePriceIDMonthly, nil
}

// CancelSubscription cancels a Stripe subscription
func (ss *StripeService) CancelSubscription(subscriptionID string) (*stripe.Subscription, error) {
	if subscriptionID == "" {
		return nil, errors.New("subscription ID is required")
	}

	return subscription.Cancel(subscriptionID, nil)
}

// UpdateSubscription updates a Stripe subscription
func (ss *StripeService) UpdateSubscription(subscriptionID string, newPriceID string) (*stripe.Subscription, error) {
	if subscriptionID == "" {
		return nil, errors.New("subscription ID is required")
	}
	if newPriceID == "" {
		return nil, errors.New("price ID is required")
	}

	// Get the subscription to find the subscription item ID
	sub, err := subscription.Get(subscriptionID, nil)
	if err != nil {
		return nil, err
	}

	if len(sub.Items.Data) == 0 {
		return nil, errors.New("no subscription items found")
	}

	params := &stripe.SubscriptionParams{
		Items: []*stripe.SubscriptionItemsParams{
			{
				ID:    stripe.String(sub.Items.Data[0].ID),
				Price: stripe.String(newPriceID),
			},
		},
	}

	return subscription.Update(subscriptionID, params)
}

// ConstructWebhookEvent constructs and verifies a webhook event
func (ss *StripeService) ConstructWebhookEvent(payload []byte, signature string) (stripe.Event, error) {
	return webhook.ConstructEvent(payload, signature, ss.WebhookSecret)
}

// GetSubscription retrieves a Stripe subscription by ID
func (ss *StripeService) GetSubscription(subscriptionID string) (*stripe.Subscription, error) {
	if subscriptionID == "" {
		return nil, errors.New("subscription ID is required")
	}

	return subscription.Get(subscriptionID, nil)
}

// CreatePortalSession creates a Stripe customer portal session
func (ss *StripeService) CreatePortalSession(customerID string, returnURL string) (string, error) {
	if customerID == "" {
		return "", errors.New("customer ID is required")
	}

	params := &stripe.BillingPortalSessionParams{
		Customer:  stripe.String(customerID),
		ReturnURL: stripe.String(returnURL),
	}

	session, err := portalSession.New(params)
	if err != nil {
		return "", err
	}

	return session.URL, nil
}


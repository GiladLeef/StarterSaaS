package resources

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/google/uuid"
)

type UpdateSubscriptionRequest struct{}

func preventDirectSubscriptionCreation(req *interface{}, userID uuid.UUID) *models.Subscription {
	panic("Subscriptions must be created through Stripe checkout flow - use POST /api/v1/billing/checkout")
}

var SubscriptionHandlers = utils.Crud[models.Subscription, interface{}, UpdateSubscriptionRequest](
	"subscription",
	preventDirectSubscriptionCreation,
)


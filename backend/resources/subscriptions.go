package resources

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/google/uuid"
)

type CreateSubscriptionRequest struct{}
type UpdateSubscriptionRequest struct{}

var Subscription = utils.SimpleCrud[models.Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest]("subscription")

func CreateSubscription(req *CreateSubscriptionRequest, userID uuid.UUID) *models.Subscription {
	return &models.Subscription{}
}

var SubscriptionHandlers = utils.Crud[models.Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest](
	"subscription",
	CreateSubscription,
)


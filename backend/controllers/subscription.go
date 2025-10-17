package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SubscriptionController struct {
	BaseController
	OrganizationController
}

func (sc *SubscriptionController) ListSubscriptions(c *gin.Context) {
	utils.ListWithOrgFilter[models.Subscription](c, sc, "subscription", "subscriptions")
}

func (sc *SubscriptionController) GetSubscription(c *gin.Context) {
	id, ok := utils.ParseUUID(c, "id", "subscription")
	if !ok {
		return
	}

	userID, ok := sc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var subscription models.Subscription
	if err := sc.FindByID(&subscription, id); err != nil {
		utils.NotFoundResponse(c, "Subscription not found")
		return
	}

	if !sc.CheckOwnership(subscription.OrganizationID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this subscription")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"subscription": subscription})
} 
package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

type SubscriptionController struct {
	BaseController
}

func (sc *SubscriptionController) ListSubscriptions(c *gin.Context) { utils.H(c, func() {
	utils.Respond(c, utils.StatusOK, "", gin.H{"subscriptions": []models.Subscription{}})
})}

func (sc *SubscriptionController) GetSubscription(c *gin.Context) { utils.H(c, func() {
	userID := utils.Get(sc.GetCurrentUserID(c))
	subscription := utils.FetchByParam[models.Subscription](c, "id")
	
	if !sc.CheckOwnership(subscription.OrganizationID, userID) {
		utils.Respond(c, utils.StatusUnauthorized, "You don't have access to this subscription", nil)
		utils.Abort()
	}

	utils.Respond(c, utils.StatusOK, "", gin.H{"subscription": subscription})
})}

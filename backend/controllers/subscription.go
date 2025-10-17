package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

type SubscriptionController struct {
	BaseController
	OrganizationController
}

func (sc *SubscriptionController) ListSubscriptions(c *gin.Context) { utils.H(c, func() {
	utils.ListWithOrgFilter[models.Subscription](c, sc, "subscription", "subscriptions")
})}

func (sc *SubscriptionController) GetSubscription(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "subscription"))
	userID := utils.Get(sc.GetCurrentUserID(c))
	subscription := utils.Try(utils.ByID[models.Subscription](id))

	if !sc.CheckOwnership(subscription.OrganizationID, userID) {
		utils.Respond(c, utils.StatusUnauthorized, "You don't have access to this subscription", nil)
		utils.Abort()
	}

	utils.Respond(c, utils.StatusOK, "", gin.H{"subscription": subscription})
})} 
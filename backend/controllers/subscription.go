package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// SubscriptionController handles subscription endpoints
type SubscriptionController struct {
	BaseController
	OrganizationController
}

// ListSubscriptions returns a list of subscriptions
func (sc *SubscriptionController) ListSubscriptions(c *gin.Context) {
	userID, ok := sc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	// Get query parameters for filtering
	orgIDStr := c.Query("organizationId")
	var orgID *uuid.UUID

	if orgIDStr != "" {
		id, err := uuid.Parse(orgIDStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID format")
			return
		}
		orgID = &id

		// Check if the user has access to the organization
		if !sc.CheckOwnership(id, userID) {
			utils.UnauthorizedResponse(c, "You don't have access to this organization")
			return
		}
	}

	var subscriptions []models.Subscription
	query := sc.FindWhere(&subscriptions, "organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = ?)", userID)
	
	if orgID != nil {
		query = query.Where("organization_id = ?", orgID)
	}

	if err := query.Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"subscriptions": subscriptions})
}

// GetSubscription returns a single subscription by ID
func (sc *SubscriptionController) GetSubscription(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid subscription ID")
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

	// Check if the user has access to the organization
	if !sc.CheckOwnership(subscription.OrganizationID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this subscription")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"subscription": subscription})
} 
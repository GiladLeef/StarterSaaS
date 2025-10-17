package utils

import (
	"net/http"
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ListWithOrgFilter lists resources that belong to organizations the user is a member of
// Optionally filters by a specific organization ID from query parameter
func ListWithOrgFilter[T any](
	c *gin.Context,
	bc interface {
		GetCurrentUserID(c *gin.Context) (uuid.UUID, bool)
		CheckOwnership(organizationID, userID uuid.UUID) bool
	},
	resourceName string,
	pluralName string,
) {
	userID, ok := bc.GetCurrentUserID(c)
	if !ok {
		UnauthorizedResponse(c, "")
		return
	}

	// Parse optional organization filter
	var orgID *uuid.UUID
	if orgIDStr := c.Query("organizationId"); orgIDStr != "" {
		id, err := uuid.Parse(orgIDStr)
		if err != nil {
			ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID format")
			return
		}

		// Check access to this organization
		if !bc.CheckOwnership(id, userID) {
			UnauthorizedResponse(c, "You don't have access to this organization")
			return
		}
		orgID = &id
	}

	// Build query
	var resources []T
	query := db.DB.Where("organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = ?)", userID)

	if orgID != nil {
		query = query.Where("organization_id = ?", *orgID)
	}

	if err := query.Find(&resources).Error; err != nil {
		ServerErrorResponse(c, err)
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{pluralName: resources})
}

// ListWithPreload lists resources with preloaded associations
func ListWithPreload[T any](
	c *gin.Context,
	query *gorm.DB,
	resourceName string,
	pluralName string,
	preload ...string,
) {
	var resources []T
	
	for _, p := range preload {
		query = query.Preload(p)
	}

	if err := query.Find(&resources).Error; err != nil {
		ServerErrorResponse(c, err)
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{pluralName: resources})
}


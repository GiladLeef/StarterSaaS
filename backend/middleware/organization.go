package middleware

import (
	"net/http"
	"platform/backend/db"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequireOrganizationAccess checks if the authenticated user has access to the organization
func RequireOrganizationAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get organization ID from route parameter
		orgID, err := uuid.Parse(c.Param("id"))
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
			c.Abort()
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			utils.UnauthorizedResponse(c, "User not authenticated")
			c.Abort()
			return
		}

		userUUID, err := uuid.Parse(userID.(string))
		if err != nil {
			utils.UnauthorizedResponse(c, "Invalid user ID")
			c.Abort()
			return
		}

		var count int64
		err = db.DB.Table("user_organizations").
			Where("user_id = ? AND organization_id = ?", userUUID, orgID).
			Count(&count).Error

		if err != nil || count == 0 {
			utils.UnauthorizedResponse(c, "You don't have access to this organization")
			c.Abort()
			return
		}

		// Store organization ID in context for use by handlers
		c.Set("organizationID", orgID)
		c.Next()
	}
}

// RequireProjectAccess checks if the authenticated user has access to a project
func RequireProjectAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get project ID from route parameter
		projectID, err := uuid.Parse(c.Param("id"))
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
			c.Abort()
			return
		}

		userID, exists := c.Get("userID")
		if !exists {
			utils.UnauthorizedResponse(c, "User not authenticated")
			c.Abort()
			return
		}

		userUUID, err := uuid.Parse(userID.(string))
		if err != nil {
			utils.UnauthorizedResponse(c, "Invalid user ID")
			c.Abort()
			return
		}

		var count int64
		err = db.DB.Table("projects").
			Joins("JOIN user_organizations ON projects.organization_id = user_organizations.organization_id").
			Where("projects.id = ? AND user_organizations.user_id = ?", projectID, userUUID).
			Count(&count).Error

		if err != nil || count == 0 {
			utils.UnauthorizedResponse(c, "You don't have access to this project")
			c.Abort()
			return
		}

		// Store project ID in context for use by handlers
		c.Set("projectID", projectID)
		c.Next()
	}
}


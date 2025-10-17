package middleware

import (
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RequireOrganizationAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				if err, ok := r.(error); ok {
					utils.UnauthorizedResponse(c, err.Error())
				} else {
					utils.UnauthorizedResponse(c, "Access denied")
				}
				c.Abort()
			}
		}()

		orgID := utils.Try(uuid.Parse(c.Param("id")))
		
		userID, exists := c.Get("userID")
		utils.Check(exists)

		userUUID, ok := userID.(uuid.UUID)
		utils.Check(ok)

		isMember := utils.Try(utils.CheckOrganizationMembership(userUUID, orgID))
		utils.Check(isMember)

		c.Set("organizationID", orgID)
		c.Next()
	}
}

func RequireProjectAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				if err, ok := r.(error); ok {
					utils.UnauthorizedResponse(c, err.Error())
				} else {
					utils.UnauthorizedResponse(c, "Access denied")
				}
				c.Abort()
			}
		}()

		projectID := utils.Try(uuid.Parse(c.Param("id")))
		
		userID, exists := c.Get("userID")
		utils.Check(exists)

		userUUID, ok := userID.(uuid.UUID)
		utils.Check(ok)

		hasAccess := utils.Try(utils.CheckProjectAccess(userUUID, projectID))
		utils.Check(hasAccess)

		c.Set("projectID", projectID)
		c.Next()
	}
}


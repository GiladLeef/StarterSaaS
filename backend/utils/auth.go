package utils

import (
	"platform/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetCurrentUserID(c *gin.Context) uuid.UUID {
	userID, exists := c.Get("userID")
	Check(exists)
	id, ok := userID.(uuid.UUID)
	Check(ok)
	return id
}

func RequireAuth(c *gin.Context) uuid.UUID {
	userID := GetCurrentUserID(c)
	Check(userID != uuid.Nil)
	return userID
}

func GetAuthenticatedUser(c *gin.Context, userID uuid.UUID) (*models.User, bool) {
	user := Try(ByID[models.User](userID))
	return &user, true
}

func RequireAuthenticatedUser(c *gin.Context, bc interface {
	RequireAuthentication(c *gin.Context) (uuid.UUID, bool)
}) (*models.User, bool) {
	userID, ok := bc.RequireAuthentication(c)
	if !ok {
		return nil, false
	}

	return GetAuthenticatedUser(c, userID)
}

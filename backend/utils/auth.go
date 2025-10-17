package utils

import (
	"platform/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

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


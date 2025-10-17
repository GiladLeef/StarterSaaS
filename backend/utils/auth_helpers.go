package utils

import (
	"platform/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetAuthenticatedUser returns the current authenticated user
// Returns the user and true if successful, or false if not found
func GetAuthenticatedUser(c *gin.Context, bc interface{ FindByID(model interface{}, id uuid.UUID) error }, userID uuid.UUID) (*models.User, bool) {
	var user models.User
	if err := bc.FindByID(&user, userID); err != nil {
		NotFoundResponse(c, "User not found")
		return nil, false
	}
	return &user, true
}

// RequireAuthenticatedUser gets the current user ID and loads the user record
func RequireAuthenticatedUser(c *gin.Context, bc interface {
	RequireAuthentication(c *gin.Context) (uuid.UUID, bool)
	FindByID(model interface{}, id uuid.UUID) error
}) (*models.User, bool) {
	userID, ok := bc.RequireAuthentication(c)
	if !ok {
		return nil, false
	}
	
	return GetAuthenticatedUser(c, bc, userID)
}


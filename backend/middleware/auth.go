package middleware

import (
	"log"
	"platform/backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// AuthRequired is a middleware that checks if the user is authenticated
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		path := c.Request.URL.Path
		
		log.Printf("Auth check for path: %s", path)
		
		// Check if header is empty or doesn't start with "Bearer "
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			log.Printf("Missing or invalid Authorization header: %s", authHeader)
			utils.UnauthorizedResponse(c, "Authorization header is required")
			c.Abort()
			return
		}

		// Extract the token
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			log.Printf("Empty token after prefix removal")
			utils.UnauthorizedResponse(c, "Token is required")
			c.Abort()
			return
		}

		// Validate the token
		userID, err := utils.ValidateToken(token)
		if err != nil {
			log.Printf("Token validation failed: %v", err)
			utils.UnauthorizedResponse(c, "Invalid token: "+err.Error())
			c.Abort()
			return
		}

		// Set the user ID in the context for controllers to use
		c.Set("userID", userID)
		log.Printf("Authentication successful for user: %s", userID)
		
		c.Next()
	}
}

// GetUserID is a helper function to extract the user ID from the context
func GetUserID(c *gin.Context) (uuid.UUID, bool) {
	userID, exists := c.Get("userID")
	if !exists {
		log.Printf("userID not found in context")
		return uuid.Nil, false
	}

	id, ok := userID.(uuid.UUID)
	if !ok {
		log.Printf("userID in context is not a UUID")
	}
	return id, ok
} 
package middleware

import (
	"log"
	"platform/backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("Auth middleware panic: %v", r)
				if err, ok := r.(error); ok {
					utils.UnauthorizedResponse(c, err.Error())
				} else {
					utils.UnauthorizedResponse(c, "Authentication failed")
				}
				c.Abort()
			}
		}()

		authHeader := c.GetHeader("Authorization")
		log.Printf("Auth check for path: %s", c.Request.URL.Path)
		
		utils.Check(authHeader != "" && strings.HasPrefix(authHeader, "Bearer "))
		
		token := strings.TrimPrefix(authHeader, "Bearer ")
		utils.Check(token != "")

		userID := utils.Try(utils.ValidateToken(token))
		
		c.Set("userID", userID)
		log.Printf("Authentication successful for user: %s", userID)
		
		c.Next()
	}
}

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
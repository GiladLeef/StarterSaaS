package utils

import (
	"platform/backend/db"
	"platform/backend/models"

	"github.com/gin-gonic/gin"
)

func RequireAdmin(c *gin.Context) {
	userID := GetCurrentUserID(c)
	var user models.User
	err := db.DB.Where("id = ? AND role = ?", userID, "admin").First(&user).Error
	Check(err == nil)
}

func IsAdmin(c *gin.Context) bool {
	userID, exists := c.Get("userID")
	if !exists {
		return false
	}
	
	var user models.User
	err := db.DB.Where("id = ? AND role = ?", userID, "admin").First(&user).Error
	return err == nil
}


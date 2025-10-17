package utils

import (
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// WithTransaction wraps database operations in a transaction with automatic rollback and error handling
func WithTransaction(c *gin.Context, fn func(tx *gorm.DB) error) bool {
	tx := db.DB.Begin()
	if tx.Error != nil {
		ServerErrorResponse(c, tx.Error)
		return false
	}

	if err := fn(tx); err != nil {
		tx.Rollback()
		ServerErrorResponse(c, err)
		return false
	}

	if err := tx.Commit().Error; err != nil {
		ServerErrorResponse(c, err)
		return false
	}

	return true
}


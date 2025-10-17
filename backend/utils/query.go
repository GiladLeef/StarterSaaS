package utils

import (
	"errors"
	"net/http"
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Exists checks if a record exists based on the query
func Exists[T any](query string, args ...interface{}) (bool, error) {
	var model T
	result := db.DB.Where(query, args...).First(&model)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return false, result.Error
	}
	return result.RowsAffected > 0, nil
}

// RequireNotExists checks that a record doesn't exist and returns error response if it does
func RequireNotExists[T any](c *gin.Context, errorMsg, query string, args ...interface{}) bool {
	exists, err := Exists[T](query, args...)
	if err != nil {
		ServerErrorResponse(c, err)
		return false
	}
	if exists {
		ErrorResponse(c, http.StatusConflict, errorMsg)
		return false
	}
	return true
}

// RequireExists checks that a record exists and returns error response if it doesn't
func RequireExists[T any](c *gin.Context, errorMsg, query string, args ...interface{}) bool {
	exists, err := Exists[T](query, args...)
	if err != nil {
		ServerErrorResponse(c, err)
		return false
	}
	if !exists {
		NotFoundResponse(c, errorMsg)
		return false
	}
	return true
}


package utils

import (
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func ExistsBy[T any](field string, value any) bool {
	var model T
	result := db.DB.Where(field+" = ?", value).First(&model)
	return result.RowsAffected > 0
}

func ExistsExcept[T any](field string, value any, exceptID uuid.UUID) bool {
	var model T
	result := db.DB.Where(field+" = ? AND id != ?", value, exceptID).First(&model)
	return result.RowsAffected > 0
}

func MustNotExistBy[T any](c *gin.Context, msg string, field string, value any) bool {
	if ExistsBy[T](field, value) {
		Respond(c, StatusConflict, msg, nil)
		return false
	}
	return true
}

func MustNotExistExcept[T any](c *gin.Context, msg string, field string, value any, exceptID uuid.UUID) bool {
	if ExistsExcept[T](field, value, exceptID) {
		Respond(c, StatusConflict, msg, nil)
		return false
	}
	return true
}

func MustExistBy[T any](c *gin.Context, msg string, field string, value any) bool {
	if !ExistsBy[T](field, value) {
		Respond(c, StatusNotFound, msg, nil)
		return false
	}
	return true
}


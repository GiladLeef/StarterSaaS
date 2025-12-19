package utils

import (
	"net/http"
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateResource(c *gin.Context, model interface{}, resourceName string, statusCode int) {
	if err := CreateDB(model); err != nil {
		ServerErrorResponse(c, err)
		return
	}
	SuccessResponse(c, statusCode, resourceName+" created successfully", gin.H{resourceName: model})
}

func ListResourcesForUser[T any](c *gin.Context, userID uuid.UUID, resourceName string) {
	var resources []T
	if err := db.DB.Where("user_id = ?", userID).Find(&resources).Error; err != nil {
		ServerErrorResponse(c, err)
		return
	}
	SuccessResponse(c, http.StatusOK, "", gin.H{resourceName: resources})
}

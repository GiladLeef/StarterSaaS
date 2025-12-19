package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ListWithOrgFilter removed as multi-tenancy is deprecated.

// ListWithPreload lists resources with preloaded associations
func ListWithPreload[T any](
	c *gin.Context,
	query *gorm.DB,
	resourceName string,
	pluralName string,
	preload ...string,
) {
	var resources []T

	for _, p := range preload {
		query = query.Preload(p)
	}

	if err := query.Find(&resources).Error; err != nil {
		ServerErrorResponse(c, err)
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{pluralName: resources})
}

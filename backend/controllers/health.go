package controllers

import (
	"platform/backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthController handles health check endpoints
type HealthController struct{}

// HealthCheck provides a simple health check endpoint
func (hc *HealthController) HealthCheck(c *gin.Context) {
	utils.SuccessResponse(c, http.StatusOK, "ok", gin.H{
		"timestamp": time.Now().Format(time.RFC3339),
	})
} 
package controllers

import (
	"platform/backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type HealthController struct{}

func (hc *HealthController) HealthCheck(c *gin.Context) {
	utils.SuccessResponse(c, http.StatusOK, "ok", gin.H{
		"timestamp": time.Now().Format(time.RFC3339),
	})
} 
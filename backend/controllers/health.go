package controllers

import (
	"platform/backend/utils"
	"time"

	"github.com/gin-gonic/gin"
)

type HealthController struct{}

func (hc *HealthController) HealthCheck(c *gin.Context) { utils.H(c, func() {
	utils.Respond(c, utils.StatusOK, "ok", gin.H{
		"timestamp": time.Now().Format(time.RFC3339),
	})
})} 
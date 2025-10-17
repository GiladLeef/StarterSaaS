package controllers

import (
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

var Health = func(c *gin.Context) {
	utils.H(c, func() {
		utils.Respond(c, utils.StatusOK, "ok", gin.H{
			"status": "healthy",
			"database": "connected",
		})
	})
}

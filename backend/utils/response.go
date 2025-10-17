package utils

import (
	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, status int, message string, data interface{}) {
	var payload gin.H
	if data != nil {
		if h, ok := data.(gin.H); ok {
			payload = h
		} else {
			payload = gin.H{"data": data}
		}
	}
	Respond(c, HTTPStatus(status), message, payload)
}

func ErrorResponse(c *gin.Context, status int, message string) {
	Respond(c, HTTPStatus(status), message, nil)
}

func ValidationErrorResponse(c *gin.Context, err error) {
	Respond(c, StatusBadRequest, err.Error(), nil)
}

func UnauthorizedResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Unauthorized"
	}
	Respond(c, StatusUnauthorized, message, nil)
}

func NotFoundResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Resource not found"
	}
	Respond(c, StatusNotFound, message, nil)
}

func ServerErrorResponse(c *gin.Context, err error) {
	RespondWithError(c, StatusError, err, "Internal server error")
} 
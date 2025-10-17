package utils

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type HTTPStatus int

const (
	StatusOK         HTTPStatus = http.StatusOK
	StatusCreated    HTTPStatus = http.StatusCreated
	StatusBadRequest HTTPStatus = http.StatusBadRequest
	StatusUnauthorized HTTPStatus = http.StatusUnauthorized
	StatusNotFound   HTTPStatus = http.StatusNotFound
	StatusConflict   HTTPStatus = http.StatusConflict
	StatusError      HTTPStatus = http.StatusInternalServerError
)

func Respond(c *gin.Context, status HTTPStatus, message string, data gin.H) {
	if status >= 400 {
		c.JSON(int(status), Response{Success: false, Error: message})
	} else {
		c.JSON(int(status), Response{Success: true, Message: message, Data: data})
	}
}

func RespondWithError(c *gin.Context, status HTTPStatus, err error, fallback string) {
	msg := fallback
	if err != nil {
		msg = err.Error()
	}
	Respond(c, status, msg, nil)
}

func GetUUID(c *gin.Context, param string) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param(param))
	if err != nil {
		Respond(c, StatusBadRequest, fmt.Sprintf("Invalid %s", param), nil)
		return uuid.Nil, false
	}
	return id, true
}

func GetQueryUUID(c *gin.Context, key string) (*uuid.UUID, bool) {
	str := c.Query(key)
	if str == "" {
		return nil, true
	}
	
	id, err := uuid.Parse(str)
	if err != nil {
		Respond(c, StatusBadRequest, fmt.Sprintf("Invalid %s format", key), nil)
		return nil, false
	}
	return &id, true
}

func CrudSuccess(c *gin.Context, action, resourceName string, data interface{}) {
	var status HTTPStatus
	var message string
	
	switch action {
	case "create":
		status = StatusCreated
		message = capitalize(resourceName) + " created successfully"
	case "update":
		status = StatusOK
		message = capitalize(resourceName) + " updated successfully"
	case "delete":
		status = StatusOK
		message = capitalize(resourceName) + " deleted successfully"
		data = nil
	default:
		status = StatusOK
		message = ""
	}
	
	response := gin.H{}
	if data != nil {
		response[resourceName] = data
	}
	
	Respond(c, status, message, response)
}

func capitalize(s string) string {
	if len(s) == 0 {
		return ""
	}
	if s[0] >= 'a' && s[0] <= 'z' {
		return string(s[0]-32) + s[1:]
	}
	return s
}


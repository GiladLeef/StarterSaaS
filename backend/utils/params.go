package utils

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func ParseUUID(c *gin.Context, paramName, resourceName string) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param(paramName))
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, fmt.Sprintf("Invalid %s ID", resourceName))
		return uuid.Nil, false
	}
	return id, true
}

func ParseOptionalUUID(c *gin.Context, param, resourceName string) (*uuid.UUID, error) {
	str := c.Query(param)
	if str == "" {
		return nil, nil
	}
	id, err := uuid.Parse(str)
	if err != nil {
		return nil, fmt.Errorf("invalid %s format", resourceName)
	}
	return &id, nil
}


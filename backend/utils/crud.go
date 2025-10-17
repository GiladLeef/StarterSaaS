package utils

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ResourceFinder interface for controllers that can find resources by ID
type ResourceFinder interface {
	FindByID(model interface{}, id uuid.UUID) error
	Update(model interface{}) error
	Delete(model interface{}) error
}

// GetByID handles GET /:id for any resource
func GetByID(
	c *gin.Context,
	finder ResourceFinder,
	model interface{},
	resourceName string,
) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, fmt.Sprintf("Invalid %s ID", resourceName))
		return
	}

	if err := finder.FindByID(model, id); err != nil {
		NotFoundResponse(c, fmt.Sprintf("%s not found", strings.Title(resourceName)))
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{resourceName: model})
}

// UpdateByID handles PUT /:id for any resource
func UpdateByID(
	c *gin.Context,
	finder ResourceFinder,
	model interface{},
	request interface{},
	resourceName string,
	updateFunc func(interface{}, interface{}),
) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, fmt.Sprintf("Invalid %s ID", resourceName))
		return
	}

	if err := c.ShouldBindJSON(request); err != nil {
		ValidationErrorResponse(c, err)
		return
	}

	if err := finder.FindByID(model, id); err != nil {
		NotFoundResponse(c, fmt.Sprintf("%s not found", strings.Title(resourceName)))
		return
	}

	// Apply updates from request to model
	updateFunc(model, request)

	if err := finder.Update(model); err != nil {
		ServerErrorResponse(c, err)
		return
	}

	SuccessResponse(c, http.StatusOK, fmt.Sprintf("%s updated successfully", strings.Title(resourceName)), gin.H{resourceName: model})
}

// DeleteByID handles DELETE /:id for any resource
func DeleteByID(
	c *gin.Context,
	finder ResourceFinder,
	model interface{},
	resourceName string,
) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, fmt.Sprintf("Invalid %s ID", resourceName))
		return
	}

	if err := finder.FindByID(model, id); err != nil {
		NotFoundResponse(c, fmt.Sprintf("%s not found", strings.Title(resourceName)))
		return
	}

	if err := finder.Delete(model); err != nil {
		ServerErrorResponse(c, err)
		return
	}

	SuccessResponse(c, http.StatusOK, fmt.Sprintf("%s deleted successfully", strings.Title(resourceName)), nil)
}


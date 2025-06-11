package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type OrganizationController struct {
	BaseController
}

type CreateOrganizationRequest struct {
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
}

type UpdateOrganizationRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// ListOrganizations returns a list of organizations for the current user
func (oc *OrganizationController) ListOrganizations(c *gin.Context) {
	userID, ok := oc.RequireAuthentication(c)
	if !ok {
		return
	}

	var organizations []models.Organization
	err := oc.FindUserOrganizations(&organizations, userID)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"organizations": organizations})
}

// CreateOrganization creates a new organization
func (oc *OrganizationController) CreateOrganization(c *gin.Context) {
	var req CreateOrganizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	userID, ok := oc.RequireAuthentication(c)
	if !ok {
		return
	}

	// Generate slug from name if not provided
	if req.Slug == "" {
		req.Slug = strings.ToLower(strings.ReplaceAll(req.Name, " ", "-"))
	} else {
		req.Slug = strings.ToLower(req.Slug)
	}

	// Ensure slug is unique by appending a number if needed
	baseSlug := req.Slug
	counter := 1
	
	for {
		var existingOrg models.Organization
		result := oc.FindOne(&existingOrg, "slug = ?", req.Slug)
		if result.RowsAffected == 0 {
			break // Slug is unique
		}
		
		// Append counter to slug and increment
		req.Slug = baseSlug + "-" + utils.IntToString(counter)
		counter++
	}

	// Create the organization
	org := models.Organization{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
	}

	// Start a transaction
	tx := db.DB.Begin()
	if tx.Error != nil {
		utils.ServerErrorResponse(c, tx.Error)
		return
	}

	// Create the organization
	if err := tx.Create(&org).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	// Add the current user to the organization
	if err := tx.Exec("INSERT INTO user_organizations (user_id, organization_id) VALUES (?, ?)", userID, org.ID).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Organization created successfully", gin.H{"organization": org})
}

// GetOrganization returns a single organization by ID
func (oc *OrganizationController) GetOrganization(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
		return
	}

	_, ok := oc.CheckOrganizationAccess(c, id)
	if !ok {
		return
	}

	var org models.Organization
	if err := oc.FindByID(&org, id); err != nil {
		utils.NotFoundResponse(c, "Organization not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"organization": org})
}

// UpdateOrganization updates an organization
func (oc *OrganizationController) UpdateOrganization(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
		return
	}

	var req UpdateOrganizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	_, ok := oc.CheckOrganizationAccess(c, id)
	if !ok {
		return
	}

	var org models.Organization
	if err := oc.FindByID(&org, id); err != nil {
		utils.NotFoundResponse(c, "Organization not found")
		return
	}

	// Update fields if provided
	if req.Name != "" {
		org.Name = req.Name
	}
	if req.Description != "" {
		org.Description = req.Description
	}

	if err := oc.Update(&org); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Organization updated successfully", gin.H{"organization": org})
}

// DeleteOrganization deletes an organization
func (oc *OrganizationController) DeleteOrganization(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
		return
	}

	_, ok := oc.CheckOrganizationAccess(c, id)
	if !ok {
		return
	}

	var org models.Organization
	if err := oc.FindByID(&org, id); err != nil {
		utils.NotFoundResponse(c, "Organization not found")
		return
	}

	if err := oc.Delete(&org); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Organization deleted successfully", nil)
}

// FindUserOrganizations finds all organizations for a user
func (oc *OrganizationController) FindUserOrganizations(organizations *[]models.Organization, userID uuid.UUID) error {
	return oc.FindWhere(organizations, "id IN (SELECT organization_id FROM user_organizations WHERE user_id = ?)", userID).Error
} 
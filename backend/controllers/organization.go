package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type OrganizationController struct {
	BaseController
}

type CreateOrganizationRequest struct {
	Name        fields.Name
	Slug        fields.Slug
	Description fields.Description
}

type UpdateOrganizationRequest struct {
	Name        fields.Name
	Description fields.Description
}

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

	if req.Slug.Value == "" {
		req.Slug.Value = strings.ToLower(strings.ReplaceAll(req.Name.Value, " ", "-"))
	} else {
		req.Slug.Value = strings.ToLower(req.Slug.Value)
	}

	baseSlug := req.Slug.Value
	counter := 1
	
	for {
		var existingOrg models.Organization
		result := oc.FindOne(&existingOrg, "slug = ?", req.Slug.Value)
		if result.RowsAffected == 0 {
			break 
		}
		
		req.Slug.Value = baseSlug + "-" + utils.IntToString(counter)
		counter++
	}

	org := models.Organization{
		Name:        req.Name.Value,
		Slug:        req.Slug.Value,
		Description: req.Description.Value,
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		utils.ServerErrorResponse(c, tx.Error)
		return
	}

	if err := tx.Create(&org).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	if err := tx.Exec("INSERT INTO user_organizations (user_id, organization_id) VALUES (?, ?)", userID, org.ID).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	if err := tx.Commit().Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Organization created successfully", gin.H{"organization": org})
}

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

	if req.Name.Value != "" {
		org.Name = req.Name.Value
	}
	if req.Description.Value != "" {
		org.Description = req.Description.Value
	}

	if err := oc.Update(&org); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Organization updated successfully", gin.H{"organization": org})
}

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

func (oc *OrganizationController) FindUserOrganizations(organizations *[]models.Organization, userID uuid.UUID) error {
	return oc.FindWhere(organizations, "id IN (SELECT organization_id FROM user_organizations WHERE user_id = ?)", userID).Error
} 
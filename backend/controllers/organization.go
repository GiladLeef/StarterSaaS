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

	// Add creator as organization member
	if err := utils.AddOrganizationMember(userID, org.ID); err != nil {
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
	// Organization access already checked by middleware
	var org models.Organization
	utils.GetByID(c, &oc.BaseController, &org, "organization")
}

func (oc *OrganizationController) UpdateOrganization(c *gin.Context) {
	// Organization access already checked by middleware
	var org models.Organization
	var req UpdateOrganizationRequest
	
	utils.UpdateByID(c, &oc.BaseController, &org, &req, "organization", func(model, request interface{}) {
		org := model.(*models.Organization)
		req := request.(*UpdateOrganizationRequest)
		
		if req.Name.Value != "" {
			org.Name = req.Name.Value
		}
		if req.Description.Value != "" {
			org.Description = req.Description.Value
		}
	})
}

func (oc *OrganizationController) DeleteOrganization(c *gin.Context) {
	// Organization access already checked by middleware
	var org models.Organization
	utils.DeleteByID(c, &oc.BaseController, &org, "organization")
}

func (oc *OrganizationController) FindUserOrganizations(organizations *[]models.Organization, userID uuid.UUID) error {
	orgs, err := utils.GetUserOrganizations(userID)
	if err != nil {
		return err
	}
	*organizations = orgs
	return nil
} 
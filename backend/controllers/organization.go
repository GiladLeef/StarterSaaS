package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
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
	req, ok := utils.BindAndValidate[CreateOrganizationRequest](c)
	if !ok {
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
		exists, _ := utils.CheckExists[models.Organization]("slug = ?", req.Slug.Value)
		if !exists {
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

	if !utils.Transaction(c, func(tx *gorm.DB) error {
		if err := tx.Create(&org).Error; err != nil {
			return err
		}
		return utils.AddOrganizationMember(userID, org.ID)
	}) {
		return
	}

	utils.Respond(c, utils.StatusCreated, "Organization created successfully", gin.H{"organization": org})
}

func (oc *OrganizationController) GetOrganization(c *gin.Context) {
	var org models.Organization
	utils.GetByID(c, &oc.BaseController, &org, "organization")
}

func (oc *OrganizationController) UpdateOrganization(c *gin.Context) {
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
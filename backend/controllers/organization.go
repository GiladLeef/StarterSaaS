package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
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

func (oc *OrganizationController) ListOrganizations(c *gin.Context) { utils.H(c, func() {
	userID := utils.Get(oc.RequireAuthentication(c))
	organizations := utils.Try(utils.GetUserOrganizations(userID))
	utils.Respond(c, utils.StatusOK, "", gin.H{"organizations": organizations})
})}

func (oc *OrganizationController) CreateOrganization(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[CreateOrganizationRequest](c))
	userID := utils.Get(oc.RequireAuthentication(c))

	if req.Slug.Value == "" {
		req.Slug.Value = strings.ToLower(strings.ReplaceAll(req.Name.Value, " ", "-"))
	} else {
		req.Slug.Value = strings.ToLower(req.Slug.Value)
	}

	baseSlug := req.Slug.Value
	counter := 1
	
	for {
		if !utils.ExistsBy[models.Organization]("slug", req.Slug.Value) {
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

	utils.TryErr(utils.Transaction(c, func(tx *gorm.DB) error {
		tx.Create(&org)
		return utils.AddOrganizationMember(userID, org.ID)
	}))

	utils.Respond(c, utils.StatusCreated, "Organization created successfully", gin.H{"organization": org})
})}

func (oc *OrganizationController) GetOrganization(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "organization"))
	utils.Get(oc.CheckOrganizationAccess(c, id))
	org := utils.Try(utils.ByID[models.Organization](id))
	utils.Respond(c, utils.StatusOK, "", gin.H{"organization": org})
})}

func (oc *OrganizationController) UpdateOrganization(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "organization"))
	utils.Get(oc.CheckOrganizationAccess(c, id))
	req := utils.Get(utils.BindAndValidate[UpdateOrganizationRequest](c))
	org := utils.Try(utils.ByID[models.Organization](id))

	utils.UpdateStringField(&org.Name, req.Name.Value)
	utils.UpdateStringField(&org.Description, req.Description.Value)

	utils.TryErr(utils.HandleCRUD(c, "update", &org, "organization"))
	utils.Respond(c, utils.StatusOK, "Organization updated successfully", gin.H{"organization": org})
})}

func (oc *OrganizationController) DeleteOrganization(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "organization"))
	utils.Get(oc.CheckOrganizationAccess(c, id))
	org := utils.Try(utils.ByID[models.Organization](id))
	utils.TryErr(utils.HandleCRUD(c, "delete", &org, "organization"))
	utils.Respond(c, utils.StatusOK, "Organization deleted successfully", nil)
})}


func (oc *OrganizationController) FindUserOrganizations(organizations *[]models.Organization, userID uuid.UUID) error {
	*organizations = utils.Try(utils.GetUserOrganizations(userID))
	return nil
} 
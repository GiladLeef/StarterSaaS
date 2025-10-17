package controllers

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

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

	slug := utils.GenerateUniqueSlug[models.Organization](req.Name.Value, req.Slug.Value, "slug")

	org := models.Organization{
		Name:        req.Name.Value,
		Slug:        slug,
		Description: req.Description.Value,
	}

	utils.TryErr(utils.Transaction(c, func(tx *gorm.DB) error {
		tx.Create(&org)
		return utils.AddOrganizationMember(userID, org.ID)
	}))

	utils.CrudSuccess(c, "create", "organization", org)
})}

func (oc *OrganizationController) GetOrganization(c *gin.Context) { utils.H(c, func() {
	org := utils.FetchByParam[models.Organization](c, "id")
	utils.Respond(c, utils.StatusOK, "", gin.H{"organization": org})
})}

func (oc *OrganizationController) UpdateOrganization(c *gin.Context) { utils.H(c, func() {
	org := utils.FetchByParam[models.Organization](c, "id")
	req := utils.Get(utils.BindAndValidate[UpdateOrganizationRequest](c))
	
	utils.UpdateStringField(&org.Name, req.Name.Value)
	utils.UpdateStringField(&org.Description, req.Description.Value)
	
	utils.TryErr(utils.HandleCRUD(c, "update", &org, "organization"))
	utils.CrudSuccess(c, "update", "organization", org)
})}

func (oc *OrganizationController) DeleteOrganization(c *gin.Context) { utils.H(c, func() {
	org := utils.FetchByParam[models.Organization](c, "id")
	utils.TryErr(utils.HandleCRUD(c, "delete", &org, "organization"))
	utils.CrudSuccess(c, "delete", "organization", nil)
})}

func (oc *OrganizationController) FindUserOrganizations(userID uuid.UUID, organizations *[]models.Organization) {
	*organizations = utils.Try(utils.GetUserOrganizations(userID))
}

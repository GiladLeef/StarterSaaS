package controllers

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationController struct{}

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
	userID := utils.RequireAuth(c)
	organizations := utils.Try(utils.GetUserOrganizations(userID))
	utils.Respond(c, utils.StatusOK, "", gin.H{"organizations": organizations})
})}

func (oc *OrganizationController) CreateOrganization(c *gin.Context) { utils.H(c, func() {
	req := *utils.BindResource[CreateOrganizationRequest](c)
	userID := utils.RequireAuth(c)

	values := utils.ExtractValues(req)
	slug := utils.GenerateUniqueSlug[models.Organization](
		values["Name"].(string), 
		values["Slug"].(string), 
		"slug",
	)

	org := models.Organization{
		Name:        values["Name"].(string),
		Slug:        slug,
		Description: values["Description"].(string),
	}

	utils.TryErr(utils.Transaction(c, func(tx *gorm.DB) error {
		tx.Create(&org)
		return utils.AddOrganizationMember(userID, org.ID)
	}))

	utils.CrudSuccess(c, "create", "organization", org)
})}

func (oc *OrganizationController) GetOrganization(c *gin.Context) { utils.H(c, func() {
	utils.RestGet[models.Organization](c, "organization")
})}

func (oc *OrganizationController) UpdateOrganization(c *gin.Context) { utils.H(c, func() {
	utils.RestUpdate[models.Organization, UpdateOrganizationRequest](c, "organization")
})}

func (oc *OrganizationController) DeleteOrganization(c *gin.Context) { utils.H(c, func() {
	utils.RestDelete[models.Organization](c, "organization")
})}

func (oc *OrganizationController) FindUserOrganizations(userID uuid.UUID, organizations *[]models.Organization) {
	*organizations = utils.Try(utils.GetUserOrganizations(userID))
}

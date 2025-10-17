package resources

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CreateOrganizationRequest struct {
	Name        fields.Name
	Slug        fields.Slug
	Description fields.Description
}

type UpdateOrganizationRequest struct {
	Name        fields.Name
	Description fields.Description
}

func CreateOrganization(req *CreateOrganizationRequest, userID uuid.UUID) *models.Organization {
	values := utils.ExtractValues(*req)
	slug := utils.GenerateUniqueSlug[models.Organization](
		values["Name"].(string), 
		values["Slug"].(string), 
		"slug",
	)

	org := &models.Organization{
		Name:        values["Name"].(string),
		Slug:        slug,
		Description: values["Description"].(string),
	}

	utils.TryErr(utils.Transaction(nil, func(tx *gorm.DB) error {
		tx.Create(org)
		return utils.AddOrganizationMember(userID, org.ID)
	}))

	return org
}

var OrganizationHandlers = utils.Crud[models.Organization, CreateOrganizationRequest, UpdateOrganizationRequest](
	"organization",
	CreateOrganization,
)

func ListOrganizations(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		organizations := utils.Try(utils.GetUserOrganizations(userID))
		utils.Respond(c, utils.StatusOK, "", gin.H{"organizations": organizations})
	})
}


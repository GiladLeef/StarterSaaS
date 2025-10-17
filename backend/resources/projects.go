package resources

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateProjectRequest struct {
	Name           fields.Name
	Description    fields.Description
	OrganizationID fields.OrganizationID
}

type UpdateProjectRequest struct {
	Name        fields.Name
	Description fields.Description
	Status      fields.Status
}

func CreateProject(req *CreateProjectRequest, userID uuid.UUID) *models.Project {
	values := utils.ExtractValues(*req)
	orgID := utils.Try(uuid.Parse(values["OrganizationID"].(string)))
	utils.Check(utils.CheckOwnership(orgID, userID))

	return &models.Project{
		Name:           values["Name"].(string),
		Description:    values["Description"].(string),
		OrganizationID: orgID,
		Status:         "active",
	}
}

var ProjectHandlers = utils.Crud[models.Project, CreateProjectRequest, UpdateProjectRequest](
	"project",
	CreateProject,
)

func ListProjects(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.GetCurrentUserID(c)
		
		orgIDStr := c.Query("organizationId")
		var orgID *uuid.UUID
		if orgIDStr != "" {
			parsedOrgID := utils.Try(uuid.Parse(orgIDStr))
			utils.Check(utils.CheckOwnership(parsedOrgID, userID))
			orgID = &parsedOrgID
		}

		utils.ListResourcesForUser[models.Project](c, userID, "projects", orgID)
	})
}


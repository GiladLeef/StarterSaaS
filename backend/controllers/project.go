package controllers

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProjectController struct{}

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

func (pc *ProjectController) ListProjects(c *gin.Context) { utils.H(c, func() {
	userID := utils.GetCurrentUserID(c)
	
	orgIDStr := c.Query("organizationId")
	var orgID *uuid.UUID
	if orgIDStr != "" {
		parsedOrgID := utils.Try(uuid.Parse(orgIDStr))
		utils.Check(utils.CheckOwnership(parsedOrgID, userID))
		orgID = &parsedOrgID
	}

	utils.ListResourcesForUser[models.Project](c, userID, "projects", orgID)
})}

func (pc *ProjectController) CreateProject(c *gin.Context) { utils.H(c, func() {
	req := *utils.BindResource[CreateProjectRequest](c)
	userID := utils.RequireAuth(c)
	
	values := utils.ExtractValues(req)
	orgID := utils.Try(uuid.Parse(values["OrganizationID"].(string)))
	utils.Check(utils.CheckOwnership(orgID, userID))

	project := models.Project{
		Name:           values["Name"].(string),
		Description:    values["Description"].(string),
		OrganizationID: orgID,
		Status:         "active",
	}

	utils.RestCreate(c, "project", &project, utils.StatusCreated)
})}

func (pc *ProjectController) GetProject(c *gin.Context) { utils.H(c, func() {
	utils.RestGet[models.Project](c, "project")
})}

func (pc *ProjectController) UpdateProject(c *gin.Context) { utils.H(c, func() {
	userID := utils.GetCurrentUserID(c)
	project := utils.FetchByParam[models.Project](c, "id")
	req := utils.Get(utils.BindAndValidate[UpdateProjectRequest](c))
	
	utils.Check(utils.CheckOwnership(project.OrganizationID, userID))
	
	utils.AutoUpdate(&project, req)
	
	utils.TryErr(utils.HandleCRUD(c, "update", &project, "project"))
	utils.CrudSuccess(c, "update", "project", project)
})}

func (pc *ProjectController) DeleteProject(c *gin.Context) { utils.H(c, func() {
	userID := utils.GetCurrentUserID(c)
	project := utils.FetchByParam[models.Project](c, "id")
	utils.Check(utils.CheckOwnership(project.OrganizationID, userID))
	
	utils.TryErr(utils.HandleCRUD(c, "delete", &project, "project"))
	utils.CrudSuccess(c, "delete", "project", nil)
})}

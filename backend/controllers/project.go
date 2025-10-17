package controllers

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProjectController struct {
	BaseController
}

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
	userID := utils.Get(pc.GetCurrentUserID(c))
	
	orgIDStr := c.Query("organizationId")
	var orgID *uuid.UUID
	if orgIDStr != "" {
		auth := utils.Get(utils.RequireAuthAndOrg(c, pc, orgIDStr))
		orgID = &auth.OrgID
	}

	utils.ListResourcesForUser[models.Project](c, userID, "projects", orgID)
})}

func (pc *ProjectController) CreateProject(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[CreateProjectRequest](c))
	auth := utils.Get(utils.RequireAuthAndOrg(c, pc, req.OrganizationID.Value))

	project := models.Project{
		Name:           req.Name.Value,
		Description:    req.Description.Value,
		OrganizationID: auth.OrgID,
		Status:         "active",
	}

	utils.CreateResource(c, &project, "project", int(utils.StatusCreated))
})}

func (pc *ProjectController) GetProject(c *gin.Context) { utils.H(c, func() {
	project := utils.FetchByParam[models.Project](c, "id")
	utils.Respond(c, utils.StatusOK, "", gin.H{"project": project})
})}

func (pc *ProjectController) UpdateProject(c *gin.Context) { utils.H(c, func() {
	userID := utils.Get(pc.GetCurrentUserID(c))
	project := utils.FetchByParam[models.Project](c, "id")
	req := utils.Get(utils.BindAndValidate[UpdateProjectRequest](c))
	
	utils.Check(pc.CheckOwnership(project.OrganizationID, userID))
	
	utils.UpdateStringField(&project.Name, req.Name.Value)
	utils.UpdateStringField(&project.Description, req.Description.Value)
	utils.UpdateStringField(&project.Status, req.Status.Value)
	
	utils.TryErr(utils.HandleCRUD(c, "update", &project, "project"))
	utils.CrudSuccess(c, "update", "project", project)
})}

func (pc *ProjectController) DeleteProject(c *gin.Context) { utils.H(c, func() {
	userID := utils.Get(pc.GetCurrentUserID(c))
	project := utils.FetchByParam[models.Project](c, "id")
	
	utils.Check(pc.CheckOwnership(project.OrganizationID, userID))
	utils.TryErr(utils.HandleCRUD(c, "delete", &project, "project"))
	utils.CrudSuccess(c, "delete", "project", nil)
})}

package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProjectController struct {
	BaseController
	OrganizationController
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

	var orgID *uuid.UUID
	if orgIDStr := c.Query("organizationId"); orgIDStr != "" {
		auth := utils.Get(utils.RequireAuthAndOrg(c, pc, orgIDStr))
		orgID = &auth.OrgID
	}

	utils.ListResourcesForUser[models.Project](c, userID, "projects", orgID)
})}

func (pc *ProjectController) CreateProject(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindJSON[CreateProjectRequest](c))
	auth := utils.Get(utils.RequireAuthAndOrg(c, pc, req.OrganizationID.Value))

	project := models.Project{
		Name:           req.Name.Value,
		Description:    req.Description.Value,
		OrganizationID: auth.OrgID,
		Status:         "active",
	}

	utils.CreateResource(c, &project, "project", http.StatusCreated)
})}

func (pc *ProjectController) GetProject(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "project"))
	userID := utils.Get(pc.GetCurrentUserID(c))
	project := utils.Try(utils.ByID[models.Project](id))
	
	utils.Check(pc.CheckOwnership(project.OrganizationID, userID))
	utils.Respond(c, utils.StatusOK, "", gin.H{"project": project})
})}

func (pc *ProjectController) UpdateProject(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "project"))
	userID := utils.Get(pc.GetCurrentUserID(c))
	req := utils.Get(utils.BindAndValidate[UpdateProjectRequest](c))
	project := utils.Try(utils.ByID[models.Project](id))
	
	utils.Check(pc.CheckOwnership(project.OrganizationID, userID))
	
	utils.UpdateStringField(&project.Name, req.Name.Value)
	utils.UpdateStringField(&project.Description, req.Description.Value)
	utils.UpdateStringField(&project.Status, req.Status.Value)

	utils.Check(utils.HandleCRUD(c, "update", &project, "project"))
	utils.Respond(c, utils.StatusOK, "Project updated successfully", gin.H{"project": project})
})}

func (pc *ProjectController) DeleteProject(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "project"))
	userID := utils.Get(pc.GetCurrentUserID(c))
	project := utils.Try(utils.ByID[models.Project](id))
	
	utils.Check(pc.CheckOwnership(project.OrganizationID, userID))
	utils.Check(utils.HandleCRUD(c, "delete", &project, "project"))
	utils.Respond(c, utils.StatusOK, "Project deleted successfully", nil)
})}
 
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

func (pc *ProjectController) ListProjects(c *gin.Context) {
	userID, ok := pc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var orgID *uuid.UUID
	if orgIDStr := c.Query("organizationId"); orgIDStr != "" {
		auth, ok := utils.RequireAuthAndOrg(c, pc, orgIDStr)
		if !ok {
			return
		}
		orgID = &auth.OrgID
	}

	utils.ListResourcesForUser[models.Project](c, userID, "projects", orgID)
}

func (pc *ProjectController) CreateProject(c *gin.Context) {
	req, ok := utils.BindJSON[CreateProjectRequest](c)
	if !ok {
		return
	}

	auth, ok := utils.RequireAuthAndOrg(c, pc, req.OrganizationID.Value)
	if !ok {
		return
	}

	project := models.Project{
		Name:           req.Name.Value,
		Description:    req.Description.Value,
		OrganizationID: auth.OrgID,
		Status:         "active",
	}

	utils.CreateResource(c, &project, "project", http.StatusCreated)
}

func (pc *ProjectController) GetProject(c *gin.Context) {
	var project models.Project
	utils.GetByID(c, &pc.BaseController, &project, "project")
}

func (pc *ProjectController) UpdateProject(c *gin.Context) {
	var project models.Project
	var req UpdateProjectRequest
	
	utils.UpdateByID(c, &pc.BaseController, &project, &req, "project", func(model, request interface{}) {
		project := model.(*models.Project)
		req := request.(*UpdateProjectRequest)
		
		if req.Name.Value != "" {
			project.Name = req.Name.Value
		}
		if req.Description.Value != "" {
			project.Description = req.Description.Value
		}
		if req.Status.Value != "" {
			project.Status = req.Status.Value
		}
	})
}

func (pc *ProjectController) DeleteProject(c *gin.Context) {
	var project models.Project
	utils.DeleteByID(c, &pc.BaseController, &project, "project")
} 
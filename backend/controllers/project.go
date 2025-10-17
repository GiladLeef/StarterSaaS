package controllers

import (
	"platform/backend/db"
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

	orgIDStr := c.Query("organizationId")
	var orgID *uuid.UUID

	if orgIDStr != "" {
		id, err := uuid.Parse(orgIDStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID format")
			return
		}
		orgID = &id

		if !pc.CheckOwnership(id, userID) {
			utils.UnauthorizedResponse(c, "You don't have access to this organization")
			return
		}
	}

	// Get user's organization IDs
	var orgIDs []uuid.UUID
	if err := db.DB.Table("user_organizations").
		Where("user_id = ?", userID).
		Pluck("organization_id", &orgIDs).Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	var projects []models.Project
	query := db.DB.Where("organization_id IN ?", orgIDs)
	
	if orgID != nil {
		query = query.Where("organization_id = ?", orgID)
	}

	if err := query.Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"projects": projects})
}

func (pc *ProjectController) CreateProject(c *gin.Context) {
	var req CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	userID, ok := pc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	orgID, err := uuid.Parse(req.OrganizationID.Value)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID format")
		return
	}

	if !pc.CheckOwnership(orgID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this organization")
		return
	}

	project := models.Project{
		Name:           req.Name.Value,
		Description:    req.Description.Value,
		OrganizationID: orgID,
		Status:         "active",
	}

	if err := pc.Create(&project); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Project created successfully", gin.H{"project": project})
}

func (pc *ProjectController) GetProject(c *gin.Context) {
	// Project access already checked by middleware
	var project models.Project
	utils.GetByID(c, &pc.BaseController, &project, "project")
}

func (pc *ProjectController) UpdateProject(c *gin.Context) {
	// Project access already checked by middleware
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
	// Project access already checked by middleware
	var project models.Project
	utils.DeleteByID(c, &pc.BaseController, &project, "project")
} 
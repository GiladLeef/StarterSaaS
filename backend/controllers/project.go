package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ProjectController handles project-related endpoints
type ProjectController struct {
	BaseController
	OrganizationController
}

type CreateProjectRequest struct {
	Name           string `json:"name" binding:"required"`
	Description    string `json:"description"`
	OrganizationID string `json:"organizationId" binding:"required"`
}

type UpdateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

// ListProjects returns a list of projects for the current user
func (pc *ProjectController) ListProjects(c *gin.Context) {
	userID, ok := pc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	// Get query parameters for filtering
	orgIDStr := c.Query("organizationId")
	var orgID *uuid.UUID

	if orgIDStr != "" {
		id, err := uuid.Parse(orgIDStr)
		if err != nil {
			utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID format")
			return
		}
		orgID = &id

		// Check if the user has access to the organization
		if !pc.CheckOwnership(id, userID) {
			utils.UnauthorizedResponse(c, "You don't have access to this organization")
			return
		}
	}

	var projects []models.Project
	query := pc.FindWhere(&projects, "organization_id IN (SELECT organization_id FROM user_organizations WHERE user_id = ?)", userID)
	
	if orgID != nil {
		query = query.Where("organization_id = ?", orgID)
	}

	if err := query.Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"projects": projects})
}

// CreateProject creates a new project
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

	// Parse organization ID
	orgID, err := uuid.Parse(req.OrganizationID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID format")
		return
	}

	// Check if the user has access to the organization
	if !pc.CheckOwnership(orgID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this organization")
		return
	}

	// Create the project
	project := models.Project{
		Name:           req.Name,
		Description:    req.Description,
		OrganizationID: orgID,
		Status:         "active",
	}

	if err := pc.Create(&project); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Project created successfully", gin.H{"project": project})
}

// GetProject returns a single project by ID
func (pc *ProjectController) GetProject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	userID, ok := pc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var project models.Project
	if err := pc.FindByID(&project, id); err != nil {
		utils.NotFoundResponse(c, "Project not found")
		return
	}

	// Check if the user has access to the organization
	if !pc.CheckOwnership(project.OrganizationID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this project")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"project": project})
}

// UpdateProject updates a project
func (pc *ProjectController) UpdateProject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	var req UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	userID, ok := pc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var project models.Project
	if err := pc.FindByID(&project, id); err != nil {
		utils.NotFoundResponse(c, "Project not found")
		return
	}

	// Check if the user has access to the organization
	if !pc.CheckOwnership(project.OrganizationID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this project")
		return
	}

	// Update fields if provided
	if req.Name != "" {
		project.Name = req.Name
	}
	if req.Description != "" {
		project.Description = req.Description
	}
	if req.Status != "" {
		project.Status = req.Status
	}

	if err := pc.Update(&project); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Project updated successfully", gin.H{"project": project})
}

// DeleteProject deletes a project
func (pc *ProjectController) DeleteProject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid project ID")
		return
	}

	userID, ok := pc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var project models.Project
	if err := pc.FindByID(&project, id); err != nil {
		utils.NotFoundResponse(c, "Project not found")
		return
	}

	// Check if the user has access to the organization
	if !pc.CheckOwnership(project.OrganizationID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this project")
		return
	}

	if err := pc.Delete(&project); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Project deleted successfully", nil)
} 
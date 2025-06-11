package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type InvitationController struct {
	BaseController
}

type CreateInvitationRequest struct {
	OrganizationID string `json:"organizationId" binding:"required"`
	Email          string `json:"email" binding:"required,email"`
}

// CreateInvitation creates a new invitation for a user to join an organization
func (ic *InvitationController) CreateInvitation(c *gin.Context) {
	var req CreateInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	// Parse organization ID
	orgID, err := uuid.Parse(req.OrganizationID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
		return
	}

	// Check if user has access to organization
	userID, ok := ic.CheckOrganizationAccess(c, orgID)
	if !ok {
		return
	}

	// Check if the user is already a member of the organization
	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected > 0 {
		// Check if the user is already a member
		var count int64
		db.DB.Table("user_organizations").
			Where("organization_id = ? AND user_id = ?", orgID, user.ID).
			Count(&count)
		
		if count > 0 {
			utils.ErrorResponse(c, http.StatusConflict, "User is already a member of this organization")
			return
		}
	}

	// Check if there's an existing pending invitation
	var existingInvitation models.OrganizationInvitation
	result = db.DB.Where("organization_id = ? AND email = ? AND status = ?", 
		orgID, req.Email, "pending").
		Where("expires_at > ?", time.Now()).
		First(&existingInvitation)
	
	if result.RowsAffected > 0 {
		utils.ErrorResponse(c, http.StatusConflict, "An invitation is already pending for this email")
		return
	}

	// Create the invitation
	invitation := models.OrganizationInvitation{
		OrganizationID: orgID,
		InviterID:      userID,
		Email:          req.Email,
		Status:         "pending",
		ExpiresAt:      time.Now().AddDate(0, 0, 7), // Expires in 7 days
	}

	if err := ic.Create(&invitation); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Invitation sent successfully", gin.H{"invitation": invitation})
}

// ListInvitations returns a list of invitations for the current user
func (ic *InvitationController) ListInvitations(c *gin.Context) {
	userID, ok := ic.RequireAuthentication(c)
	if !ok {
		return
	}

	// Get the user's email
	var user models.User
	if err := ic.FindByID(&user, userID); err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	// Get invitations for the user's email
	var invitations []models.OrganizationInvitation
	err := db.DB.Preload("Organization").Preload("Inviter").
		Where("email = ? AND status = ? AND expires_at > ?", 
			user.Email, "pending", time.Now()).
		Find(&invitations).Error
	
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"invitations": invitations})
}

// AcceptInvitation accepts an invitation for a user to join an organization
func (ic *InvitationController) AcceptInvitation(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid invitation ID")
		return
	}

	userID, ok := ic.RequireAuthentication(c)
	if !ok {
		return
	}

	// Get the user's email
	var user models.User
	if err := ic.FindByID(&user, userID); err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	// Get the invitation
	var invitation models.OrganizationInvitation
	err = db.DB.Where("id = ? AND email = ? AND status = ? AND expires_at > ?", 
		id, user.Email, "pending", time.Now()).
		First(&invitation).Error
	
	if err != nil {
		utils.NotFoundResponse(c, "Invitation not found or expired")
		return
	}

	// Start a transaction
	tx := db.DB.Begin()
	if tx.Error != nil {
		utils.ServerErrorResponse(c, tx.Error)
		return
	}

	// Update invitation status
	invitation.Status = "accepted"
	if err := tx.Save(&invitation).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	// Add the user to the organization
	if err := tx.Exec("INSERT INTO user_organizations (user_id, organization_id) VALUES (?, ?)", 
		userID, invitation.OrganizationID).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Invitation accepted successfully", nil)
}

// DeclineInvitation declines an invitation
func (ic *InvitationController) DeclineInvitation(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid invitation ID")
		return
	}

	userID, ok := ic.RequireAuthentication(c)
	if !ok {
		return
	}

	// Get the user's email
	var user models.User
	if err := ic.FindByID(&user, userID); err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	// Get the invitation
	var invitation models.OrganizationInvitation
	err = db.DB.Where("id = ? AND email = ? AND status = ?", 
		id, user.Email, "pending").
		First(&invitation).Error
	
	if err != nil {
		utils.NotFoundResponse(c, "Invitation not found")
		return
	}

	// Update invitation status
	invitation.Status = "declined"
	if err := db.DB.Save(&invitation).Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Invitation declined successfully", nil)
} 
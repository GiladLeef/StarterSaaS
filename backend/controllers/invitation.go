package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type InvitationController struct {
	BaseController
}

type CreateInvitationRequest struct {
	OrganizationID fields.OrganizationID
	Email          fields.Email
}

func (ic *InvitationController) CreateInvitation(c *gin.Context) {
	var req CreateInvitationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	orgID, err := uuid.Parse(req.OrganizationID.Value)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
		return
	}

	userID, ok := ic.CheckOrganizationAccess(c, orgID)
	if !ok {
		return
	}

	var user models.User
	result := db.DB.Where("email = ?", req.Email.Value).First(&user)
	if result.RowsAffected > 0 {
		var count int64
		db.DB.Table("user_organizations").
			Where("organization_id = ? AND user_id = ?", orgID, user.ID).
			Count(&count)
		
		if count > 0 {
			utils.ErrorResponse(c, http.StatusConflict, "User is already a member of this organization")
			return
		}
	}

	var existingInvitation models.OrganizationInvitation
	result = db.DB.Where("organization_id = ? AND email = ? AND status = ?", 
		orgID, req.Email.Value, "pending").
		Where("expires_at > ?", time.Now()).
		First(&existingInvitation)
	
	if result.RowsAffected > 0 {
		utils.ErrorResponse(c, http.StatusConflict, "An invitation is already pending for this email")
		return
	}

	invitation := models.OrganizationInvitation{
		OrganizationID: orgID,
		InviterID:      userID,
		Email:          req.Email.Value,
		Status:         "pending",
		ExpiresAt:      time.Now().AddDate(0, 0, 7), 
	}

	if err := ic.Create(&invitation); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Invitation sent successfully", gin.H{"invitation": invitation})
}

func (ic *InvitationController) ListInvitations(c *gin.Context) {
	userID, ok := ic.RequireAuthentication(c)
	if !ok {
		return
	}

	var user models.User
	if err := ic.FindByID(&user, userID); err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

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

func (ic *InvitationController) AcceptInvitation(c *gin.Context) {
	id, ok := utils.ParseUUID(c, "id", "invitation")
	if !ok {
		return
	}

	userID, ok := ic.RequireAuthentication(c)
	if !ok {
		return
	}

	var user models.User
	if err := ic.FindByID(&user, userID); err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	var invitation models.OrganizationInvitation
	err := db.DB.Where("id = ? AND email = ? AND status = ? AND expires_at > ?", 
		id, user.Email, "pending", time.Now()).
		First(&invitation).Error
	
	if err != nil {
		utils.NotFoundResponse(c, "Invitation not found or expired")
		return
	}

	if !utils.WithTransaction(c, func(tx *gorm.DB) error {
		invitation.Status = "accepted"
		if err := tx.Save(&invitation).Error; err != nil {
			return err
		}
		return tx.Exec("INSERT INTO user_organizations (user_id, organization_id) VALUES (?, ?)", 
			userID, invitation.OrganizationID).Error
	}) {
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Invitation accepted successfully", nil)
}

func (ic *InvitationController) DeclineInvitation(c *gin.Context) {
	id, ok := utils.ParseUUID(c, "id", "invitation")
	if !ok {
		return
	}

	userID, ok := ic.RequireAuthentication(c)
	if !ok {
		return
	}

	var user models.User
	if err := ic.FindByID(&user, userID); err != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	var invitation models.OrganizationInvitation
	err := db.DB.Where("id = ? AND email = ? AND status = ?", 
		id, user.Email, "pending").
		First(&invitation).Error
	
	if err != nil {
		utils.NotFoundResponse(c, "Invitation not found")
		return
	}

	invitation.Status = "declined"
	if err := db.DB.Save(&invitation).Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Invitation declined successfully", nil)
} 
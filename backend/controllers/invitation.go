package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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
	req, ok := utils.BindAndValidate[CreateInvitationRequest](c)
	if !ok {
		return
	}

	orgID, ok := utils.GetUUID(c, req.OrganizationID.Value)
	if !ok {
		return
	}

	userID, ok := ic.CheckOrganizationAccess(c, orgID)
	if !ok {
		return
	}

	user, _ := utils.Query[models.User]("email = ?", req.Email.Value)
	if user != nil {
		if !utils.RequireNotOrganizationMember(c, user.ID, orgID) {
			return
		}
	}

	if !utils.MustNotExist[models.OrganizationInvitation](c, 
		"An invitation is already pending for this email",
		"organization_id = ? AND email = ? AND status = ? AND expires_at > ?",
		orgID, req.Email.Value, "pending", time.Now()) {
		return
	}

	invitation := models.OrganizationInvitation{
		OrganizationID: orgID,
		InviterID:      userID,
		Email:          req.Email.Value,
		Status:         "pending",
		ExpiresAt:      time.Now().AddDate(0, 0, 7), 
	}

	if !utils.HandleCRUD(c, "create", &invitation, "invitation") {
		return
	}

	utils.Respond(c, utils.StatusCreated, "Invitation sent successfully", gin.H{"invitation": invitation})
}

func (ic *InvitationController) ListInvitations(c *gin.Context) {
	user, ok := utils.RequireAuthenticatedUser(c, ic)
	if !ok {
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

	user, ok := utils.RequireAuthenticatedUser(c, ic)
	if !ok {
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
		return utils.AddOrganizationMember(user.ID, invitation.OrganizationID)
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

	user, ok := utils.RequireAuthenticatedUser(c, ic)
	if !ok {
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
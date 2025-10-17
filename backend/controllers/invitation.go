package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
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

func (ic *InvitationController) CreateInvitation(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[CreateInvitationRequest](c))
	orgID := utils.Get(utils.GetUUID(c, req.OrganizationID.Value))
	userID := utils.Get(ic.CheckOrganizationAccess(c, orgID))

	user, _ := utils.ByEmail[models.User](req.Email.Value)
	if user.ID != uuid.Nil {
		utils.Check(utils.RequireNotOrganizationMember(c, user.ID, orgID))
	}

	if utils.HasPendingInvitation(orgID, req.Email.Value) {
		utils.Respond(c, utils.StatusConflict, "An invitation is already pending for this email", nil)
		utils.Abort()
	}

	invitation := models.OrganizationInvitation{
		OrganizationID: orgID,
		InviterID:      userID,
		Email:          req.Email.Value,
		Status:         "pending",
		ExpiresAt:      time.Now().AddDate(0, 0, 7), 
	}

	utils.TryErr(utils.HandleCRUD(c, "create", &invitation, "invitation"))
	utils.Respond(c, utils.StatusCreated, "Invitation sent successfully", gin.H{"invitation": invitation})
})}

func (ic *InvitationController) ListInvitations(c *gin.Context) { utils.H(c, func() {
	user := utils.Get(utils.RequireAuthenticatedUser(c, ic))
	invitations := utils.Try(utils.FindUserPendingInvitations(user.Email))
	utils.Respond(c, utils.StatusOK, "", gin.H{"invitations": invitations})
})}

func (ic *InvitationController) AcceptInvitation(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "invitation"))
	user := utils.Get(utils.RequireAuthenticatedUser(c, ic))
	invitation := utils.Try(utils.FindValidInvitation(id, user.Email))

	utils.TryErr(utils.Transaction(c, func(tx *gorm.DB) error {
		invitation.Status = "accepted"
		tx.Save(invitation)
		return utils.AddOrganizationMember(user.ID, invitation.OrganizationID)
	}))

	utils.Respond(c, utils.StatusOK, "Invitation accepted successfully", nil)
})}

func (ic *InvitationController) DeclineInvitation(c *gin.Context) { utils.H(c, func() {
	id := utils.Get(utils.ParseUUID(c, "id", "invitation"))
	user := utils.Get(utils.RequireAuthenticatedUser(c, ic))
	invitation := utils.Try(utils.FindUserInvitation(id, user.Email))

	invitation.Status = "declined"
	utils.TryErr(utils.HandleCRUD(c, "update", invitation, "invitation"))
	utils.Respond(c, utils.StatusOK, "Invitation declined successfully", nil)
})} 
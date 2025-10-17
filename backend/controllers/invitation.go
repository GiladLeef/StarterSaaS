package controllers

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type InvitationController struct {
	BaseController
}

type CreateInvitationRequest struct {
	Email          fields.Email
	OrganizationID fields.OrganizationID
}

func (ic *InvitationController) CreateInvitation(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[CreateInvitationRequest](c))
	orgID := utils.Get(utils.GetUUID(c, req.OrganizationID.Value))
	userID := utils.Get(ic.RequireAuthentication(c))
	
	utils.Check(utils.Try(utils.CheckOrganizationMembership(userID, orgID)))
	
	userToInvite, userErr := utils.ByEmail[models.User](req.Email.Value)
	if userErr == nil {
		utils.Check(!utils.Try(utils.CheckOrganizationMembership(userToInvite.ID, orgID)))
	}
	
	utils.Check(!utils.HasPendingInvitation(orgID, req.Email.Value))
	
	invitation := models.OrganizationInvitation{
		Email:          req.Email.Value,
		OrganizationID: orgID,
		InviterID:      userID,
		Status:         "pending",
		ExpiresAt:      time.Now().Add(7 * 24 * time.Hour),
	}

	utils.TryErr(utils.HandleCRUD(c, "create", &invitation, "invitation"))
	utils.CrudSuccess(c, "create", "invitation", invitation)
})}

func (ic *InvitationController) ListUserInvitations(c *gin.Context) { utils.H(c, func() {
	user := utils.Get(utils.RequireAuthenticatedUser(c, ic))
	invitations := utils.Try(utils.FindUserPendingInvitations(user.Email))
	utils.Respond(c, utils.StatusOK, "", gin.H{"invitations": invitations})
})}

func (ic *InvitationController) AcceptInvitation(c *gin.Context) { utils.H(c, func() {
	user := utils.Get(utils.RequireAuthenticatedUser(c, ic))
	invitation := utils.FetchByParam[models.OrganizationInvitation](c, "id")
	
	utils.Check(invitation.Email == user.Email)
	utils.Check(invitation.Status == "pending")
	utils.Check(time.Now().Before(invitation.ExpiresAt))

	utils.TryErr(utils.Transaction(c, func(tx *gorm.DB) error {
		invitation.Status = "accepted"
		tx.Save(&invitation)
		return utils.AddOrganizationMember(user.ID, invitation.OrganizationID)
	}))

	utils.CrudSuccess(c, "update", "invitation", nil)
})}

func (ic *InvitationController) DeclineInvitation(c *gin.Context) { utils.H(c, func() {
	user := utils.Get(utils.RequireAuthenticatedUser(c, ic))
	invitation := utils.FetchByParam[models.OrganizationInvitation](c, "id")
	
	utils.Check(invitation.Email == user.Email)
	invitation.Status = "declined"
	utils.TryErr(utils.HandleCRUD(c, "update", &invitation, "invitation"))
	utils.CrudSuccess(c, "update", "invitation", nil)
})}

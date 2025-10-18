package resources

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CreateInvitationRequest struct {
	Email          fields.Email
	OrganizationID fields.OrganizationID
}

type UpdateInvitationRequest struct{}

func createInvitationFactory(req *CreateInvitationRequest, userID uuid.UUID) *models.OrganizationInvitation {
	orgID := utils.Try(uuid.Parse(req.OrganizationID.Value))
	
	utils.Check(utils.Try(utils.CheckOrganizationMembership(userID, orgID)))
	
	userToInvite, userErr := utils.ByEmail[models.User](req.Email.Value)
	if userErr == nil {
		utils.Check(!utils.Try(utils.CheckOrganizationMembership(userToInvite.ID, orgID)))
	}
	
	utils.Check(!utils.HasPendingInvitation(orgID, req.Email.Value))
	
	return &models.OrganizationInvitation{
		Email:          req.Email.Value,
		OrganizationID: orgID,
		InviterID:      userID,
		Status:         "pending",
		ExpiresAt:      time.Now().Add(7 * 24 * time.Hour),
	}
}

var InvitationHandlers = utils.Crud[models.OrganizationInvitation, CreateInvitationRequest, UpdateInvitationRequest](
	"invitation",
	createInvitationFactory,
)

var CreateInvitation = InvitationHandlers["create"]

func ListUserInvitations(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		user := utils.Try(utils.ByID[models.User](userID))
		invitations := utils.Try(utils.FindUserPendingInvitations(user.Email))
		utils.Respond(c, utils.StatusOK, "", gin.H{"invitations": invitations})
	})
}

func AcceptInvitation(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		user := utils.Try(utils.ByID[models.User](userID))
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
	})
}

func DeclineInvitation(c *gin.Context) {
	utils.H(c, func() {
		userID := utils.RequireAuth(c)
		user := utils.Try(utils.ByID[models.User](userID))
		invitation := utils.FetchByParam[models.OrganizationInvitation](c, "id")
		
		utils.Check(invitation.Email == user.Email)
		invitation.Status = "declined"
		utils.TryErr(utils.HandleCRUD(c, "update", &invitation, "invitation"))
		utils.CrudSuccess(c, "update", "invitation", nil)
	})
}


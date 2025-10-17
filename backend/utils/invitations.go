package utils

import (
	"platform/backend/db"
	"platform/backend/models"
	"time"

	"github.com/google/uuid"
)

func FindPendingInvitation(orgID uuid.UUID, email string) (*models.OrganizationInvitation, error) {
	var invitation models.OrganizationInvitation
	err := db.DB.Where("organization_id = ? AND email = ? AND status = ? AND expires_at > ?", 
		orgID, email, "pending", time.Now()).First(&invitation).Error
	return &invitation, err
}

func HasPendingInvitation(orgID uuid.UUID, email string) bool {
	_, err := FindPendingInvitation(orgID, email)
	return err == nil
}

func FindUserPendingInvitations(email string) ([]models.OrganizationInvitation, error) {
	var invitations []models.OrganizationInvitation
	err := db.DB.Preload("Organization").Preload("Inviter").
		Where("email = ? AND status = ? AND expires_at > ?", email, "pending", time.Now()).
		Find(&invitations).Error
	return invitations, err
}

func FindValidInvitation(id uuid.UUID, email string) (*models.OrganizationInvitation, error) {
	var invitation models.OrganizationInvitation
	err := db.DB.Where("id = ? AND email = ? AND status = ? AND expires_at > ?", 
		id, email, "pending", time.Now()).First(&invitation).Error
	return &invitation, err
}

func FindUserInvitation(id uuid.UUID, email string) (*models.OrganizationInvitation, error) {
	var invitation models.OrganizationInvitation
	err := db.DB.Where("id = ? AND email = ? AND status = ?", 
		id, email, "pending").First(&invitation).Error
	return &invitation, err
}


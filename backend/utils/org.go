package utils

import (
	"platform/backend/db"
	"platform/backend/models"

	"github.com/google/uuid"
)

// GetOrgOwner gets the first user/owner of an organization using DRY pattern
func GetOrgOwner(orgID uuid.UUID) (models.User, error) {
	var user models.User
	err := db.DB.Joins("JOIN organization_memberships ON organization_memberships.user_id = users.id").
		Where("organization_memberships.organization_id = ?", orgID).
		First(&user).Error
	return user, err
}


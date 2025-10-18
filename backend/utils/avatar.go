package utils

import (
	"platform/backend/models"

	"github.com/google/uuid"
)

// AvatarService provides DRY methods for avatar operations
type AvatarService struct{}

// UpdateUserAvatar updates the user's avatar using DRY utilities
func (as *AvatarService) UpdateUserAvatar(userID uuid.UUID, avatarURL string) (*models.User, error) {
	user, err := ByID[models.User](userID)
	if err != nil {
		return nil, err
	}

	user.Avatar = avatarURL
	err = Save(&user)
	return &user, err
}

// DeleteUserAvatar removes the user's avatar using DRY utilities
func (as *AvatarService) DeleteUserAvatar(userID uuid.UUID) error {
	user, err := ByID[models.User](userID)
	if err != nil {
		return err
	}

	user.Avatar = ""
	return Save(&user)
}


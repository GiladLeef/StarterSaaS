package utils

import (
	"platform/backend/db"
	"platform/backend/models"
)

// FindPasswordResetToken finds a password reset token with preloaded user
func FindPasswordResetToken(token string) (*models.PasswordResetToken, error) {
	var resetToken models.PasswordResetToken
	err := db.DB.Where("token = ?", token).Preload("User").First(&resetToken).Error
	return &resetToken, err
}

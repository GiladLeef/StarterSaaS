package utils

import (
	"platform/backend/db"
	"platform/backend/models"
)

func ByToken[T any](token string) (T, error) {
	var model T
	err := db.DB.Where("token = ?", token).Preload("User").First(&model).Error
	return model, err
}

func FindPasswordResetToken(token string) (*models.PasswordResetToken, error) {
	var resetToken models.PasswordResetToken
	err := db.DB.Where("token = ?", token).Preload("User").First(&resetToken).Error
	return &resetToken, err
}


package utils

import (
	"platform/backend/db"

	"github.com/google/uuid"
)

func ByID[T any](id uuid.UUID) (T, error) {
	var model T
	err := db.DB.First(&model, id).Error
	return model, err
}

func ByEmail[T any](email string) (T, error) {
	var model T
	err := db.DB.Where("email = ?", email).First(&model).Error
	return model, err
}

func BySlug[T any](slug string) (T, error) {
	var model T
	err := db.DB.Where("slug = ?", slug).First(&model).Error
	return model, err
}

func Where[T any](field string, value any) (T, error) {
	var model T
	err := db.DB.Where(field+" = ?", value).First(&model).Error
	return model, err
}

func All[T any]() ([]T, error) {
	var models []T
	err := db.DB.Find(&models).Error
	return models, err
}


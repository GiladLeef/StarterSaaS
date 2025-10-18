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

func WhereMultiple[T any](conditions map[string]any) (T, error) {
	var model T
	query := db.DB
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	err := query.First(&model).Error
	return model, err
}

func WhereMultipleList[T any](conditions map[string]any) ([]T, error) {
	var models []T
	query := db.DB
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	err := query.Find(&models).Error
	return models, err
}

func FirstOrNil[T any](conditions map[string]any) *T {
	model, err := WhereMultiple[T](conditions)
	if err != nil {
		return nil
	}
	return &model
}

func All[T any]() ([]T, error) {
	var models []T
	err := db.DB.Find(&models).Error
	return models, err
}

// WhereWithOrder finds records with WHERE condition and ORDER BY
func WhereWithOrder[T any](field string, value any, orderBy string) ([]T, error) {
	var models []T
	err := db.DB.Where(field+" = ?", value).Order(orderBy).Find(&models).Error
	return models, err
}

// WhereMultipleWithOrder finds records with multiple WHERE conditions and ORDER BY
func WhereMultipleWithOrder[T any](conditions map[string]any, orderBy string) ([]T, error) {
	var models []T
	query := db.DB
	for field, value := range conditions {
		query = query.Where(field+" = ?", value)
	}
	err := query.Order(orderBy).Find(&models).Error
	return models, err
}


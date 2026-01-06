package utils

import (
	"platform/backend/db"

	"github.com/google/uuid"
)

// Generic DRY database operations

func Save[T any](model *T) error {
	return db.DB.Save(model).Error
}

func Create[T any](model *T) error {
	return db.DB.Create(model).Error
}

func Delete[T any](model *T) error {
	return db.DB.Delete(model).Error
}

// Legacy functions for backward compatibility
func CreateDB(model interface{}) error {
	return db.DB.Create(model).Error
}

func UpdateDB(model interface{}) error {
	return db.DB.Save(model).Error
}

func DeleteDB(model interface{}) error {
	return db.DB.Delete(model).Error
}

func FindByIDDB(model interface{}, id uuid.UUID) error {
	return db.DB.First(model, id).Error
}

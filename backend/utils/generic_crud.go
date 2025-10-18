package utils

import (
	"platform/backend/db"

	"github.com/google/uuid"
)

// FindByIDGeneric finds a record by ID for any model type (used with reflection)
func FindByIDGeneric(model interface{}, id uuid.UUID) error {
	return db.DB.First(model, "id = ?", id).Error
}

// SaveGeneric saves a record for any model type (used with reflection)
func SaveGeneric(model interface{}) error {
	return db.DB.Save(model).Error
}

// DeleteByIDGeneric deletes a record by ID for any model type (used with reflection)
func DeleteByIDGeneric(model interface{}, id uuid.UUID) error {
	return db.DB.Delete(model, "id = ?", id).Error
}


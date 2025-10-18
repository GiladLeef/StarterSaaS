package utils

import (
	"platform/backend/db"

	"github.com/google/uuid"
	"gorm.io/gorm"
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

func GetUserOrgIDs(userID uuid.UUID, orgIDs *[]uuid.UUID) error {
	return db.DB.Table("user_organizations").
		Where("user_id = ?", userID).
		Pluck("organization_id", orgIDs).Error
}

func BuildOrgQuery(orgIDs []uuid.UUID, orgFilter *uuid.UUID) *gorm.DB {
	query := db.DB.Where("organization_id IN ?", orgIDs)
	if orgFilter != nil {
		query = query.Where("organization_id = ?", *orgFilter)
	}
	return query
}


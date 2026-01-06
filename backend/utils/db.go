package utils

import (
	"platform/backend/db"
)

func Save[T any](model *T) error {
	return db.DB.Save(model).Error
}

func Create[T any](model *T) error {
	return db.DB.Create(model).Error
}

func Delete[T any](model *T) error {
	return db.DB.Delete(model).Error
}

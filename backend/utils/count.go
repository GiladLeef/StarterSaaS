package utils

import "platform/backend/db"

func Count[T any]() (int64, error) {
	var count int64
	var model T
	err := db.DB.Model(&model).Count(&count).Error
	return count, err
}

func CountWhere[T any](query string, args ...interface{}) (int64, error) {
	var count int64
	var model T
	err := db.DB.Model(&model).Where(query, args...).Count(&count).Error
	return count, err
}


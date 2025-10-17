package utils

import (
	"errors"
	"fmt"
	"platform/backend/db"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DBOperation func(interface{}) error

func Query[T any](where string, args ...interface{}) (*T, error) {
	var model T
	result := db.DB.Where(where, args...).First(&model)
	if result.Error != nil {
		return nil, result.Error
	}
	return &model, nil
}

func QueryAll[T any](where string, args ...interface{}) ([]T, error) {
	var models []T
	result := db.DB.Where(where, args...).Find(&models)
	if result.Error != nil {
		return nil, result.Error
	}
	return models, nil
}

func CheckExists[T any](where string, args ...interface{}) (bool, error) {
	var model T
	result := db.DB.Where(where, args...).First(&model)
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return false, result.Error
	}
	return result.RowsAffected > 0, nil
}

func MustExist[T any](c *gin.Context, msg, where string, args ...interface{}) bool {
	exists, err := CheckExists[T](where, args...)
	if err != nil {
		RespondWithError(c, StatusError, err, "Database error")
		return false
	}
	if !exists {
		Respond(c, StatusNotFound, msg, nil)
		return false
	}
	return true
}

func MustNotExist[T any](c *gin.Context, msg, where string, args ...interface{}) bool {
	exists, err := CheckExists[T](where, args...)
	if err != nil {
		RespondWithError(c, StatusError, err, "Database error")
		return false
	}
	if exists {
		Respond(c, StatusConflict, msg, nil)
		return false
	}
	return true
}

func HandleCRUD[T any](c *gin.Context, operation string, model *T, name string) bool {
	var err error
	switch operation {
	case "create":
		err = db.DB.Create(model).Error
	case "update":
		err = db.DB.Save(model).Error
	case "delete":
		err = db.DB.Delete(model).Error
	case "find":
		id, ok := GetUUID(c, "id")
		if !ok {
			return false
		}
		err = db.DB.First(model, id).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			Respond(c, StatusNotFound, fmt.Sprintf("%s not found", strings.Title(name)), nil)
			return false
		}
	}
	
	if err != nil {
		RespondWithError(c, StatusError, err, "Operation failed")
		return false
	}
	return true
}

func BindAndValidate[T any](c *gin.Context) (*T, bool) {
	var req T
	if err := c.ShouldBindJSON(&req); err != nil {
		Respond(c, StatusBadRequest, err.Error(), nil)
		return nil, false
	}
	return &req, true
}

func Execute(c *gin.Context, fn func() error, errMsg string) bool {
	if err := fn(); err != nil {
		RespondWithError(c, StatusError, err, errMsg)
		return false
	}
	return true
}

func Transaction(c *gin.Context, fn func(*gorm.DB) error) bool {
	return Execute(c, func() error {
		tx := db.DB.Begin()
		if tx.Error != nil {
			return tx.Error
		}
		
		if err := fn(tx); err != nil {
			tx.Rollback()
			return err
		}
		
		return tx.Commit().Error
	}, "Transaction failed")
}

func ApplyUpdates[T any](target *T, updates map[string]interface{}) {
	for field, value := range updates {
		if value != nil && value != "" {
			db.DB.Model(target).Update(field, value)
		}
	}
}


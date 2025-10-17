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

func MustNotExist[T any](c *gin.Context, msg, where string, args ...interface{}) error {
	exists, err := CheckExists[T](where, args...)
	if err != nil {
		return err
	}
	if exists {
		Respond(c, StatusConflict, msg, nil)
		return fmt.Errorf(msg)
	}
	return nil
}

func HandleCRUD(c *gin.Context, action string, model interface{}, resourceName string) error {
	var err error
	switch action {
	case "create":
		err = db.DB.Create(model).Error
	case "update":
		err = db.DB.Save(model).Error
	case "delete":
		err = db.DB.Delete(model).Error
	default:
		return fmt.Errorf("unknown action: %s", action)
	}
	
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if c != nil {
				NotFoundResponse(c, strings.Title(resourceName)+" not found")
			}
			return err
		}
		if c != nil {
			RespondWithError(c, StatusError, err, "Failed to "+action+" "+resourceName)
		}
		return err
	}
	
	return nil
}

func BindAndValidate[T any](c *gin.Context) (*T, bool) {
	var req T
	if err := c.ShouldBindJSON(&req); err != nil {
		ValidationErrorResponse(c, err)
		return nil, false
	}
	return &req, true
}

func Execute(c *gin.Context, fn func() error, msg string) error {
	if err := fn(); err != nil {
		RespondWithError(c, StatusError, err, msg)
		return err
	}
	return nil
}

func Transaction(c *gin.Context, fn func(tx *gorm.DB) error) error {
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

func UpdateField[T comparable](target *T, value T) {
	var zero T
	if value != zero {
		*target = value
	}
}

func UpdateStringField(target *string, value string) {
	if value != "" {
		*target = value
	}
}

package controllers

import (
	"platform/backend/db"
	"platform/backend/middleware"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// BaseController provides common controller functionality
type BaseController struct{}

// GetCurrentUserID gets the current user ID from the context
func (b *BaseController) GetCurrentUserID(c *gin.Context) (uuid.UUID, bool) {
	return middleware.GetUserID(c)
}

// RequireAuthentication checks if user is authenticated and returns userID or responds with unauthorized
func (b *BaseController) RequireAuthentication(c *gin.Context) (uuid.UUID, bool) {
	userID, ok := b.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return uuid.Nil, false
	}
	return userID, true
}

// CheckOrganizationAccess checks if the user has access to the organization
func (b *BaseController) CheckOrganizationAccess(c *gin.Context, orgID uuid.UUID) (uuid.UUID, bool) {
	userID, ok := b.RequireAuthentication(c)
	if !ok {
		return uuid.Nil, false
	}
	
	if !b.CheckOwnership(orgID, userID) {
		utils.UnauthorizedResponse(c, "You don't have access to this organization")
		return uuid.Nil, false
	}
	
	return userID, true
}

// FindByID finds a record by ID with the given model
func (b *BaseController) FindByID(model interface{}, id uuid.UUID) error {
	return db.DB.First(model, id).Error
}

// Create creates a new record
func (b *BaseController) Create(model interface{}) error {
	return db.DB.Create(model).Error
}

// Update updates a record
func (b *BaseController) Update(model interface{}) error {
	return db.DB.Save(model).Error
}

// Delete deletes a record
func (b *BaseController) Delete(model interface{}) error {
	return db.DB.Delete(model).Error
}

// CheckOwnership checks if the given userID has access to the given organization
func (b *BaseController) CheckOwnership(orgID uuid.UUID, userID uuid.UUID) bool {
	var count int64
	db.DB.Table("user_organizations").
		Where("organization_id = ? AND user_id = ?", orgID, userID).
		Count(&count)
	return count > 0
}

// FindWhere finds records based on conditions
func (b *BaseController) FindWhere(dest interface{}, query interface{}, args ...interface{}) *gorm.DB {
	return db.DB.Where(query, args...).Find(dest)
}

// FindOne finds a single record based on conditions
func (b *BaseController) FindOne(dest interface{}, query interface{}, args ...interface{}) *gorm.DB {
	return db.DB.Where(query, args...).First(dest)
} 
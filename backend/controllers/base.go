package controllers

import (
	"platform/backend/db"
	"platform/backend/middleware"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BaseController struct{}

func (b *BaseController) GetCurrentUserID(c *gin.Context) (uuid.UUID, bool) {
	return middleware.GetUserID(c)
}

func (b *BaseController) RequireAuthentication(c *gin.Context) (uuid.UUID, bool) {
	userID, ok := b.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return uuid.Nil, false
	}
	return userID, true
}

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

func (b *BaseController) FindByID(model interface{}, id uuid.UUID) error {
	return db.DB.First(model, id).Error
}

func (b *BaseController) Create(model interface{}) error {
	return db.DB.Create(model).Error
}

func (b *BaseController) Update(model interface{}) error {
	return db.DB.Save(model).Error
}

func (b *BaseController) Delete(model interface{}) error {
	return db.DB.Delete(model).Error
}

func (b *BaseController) CheckOwnership(orgID uuid.UUID, userID uuid.UUID) bool {
	var count int64
	db.DB.Table("user_organizations").
		Where("organization_id = ? AND user_id = ?", orgID, userID).
		Count(&count)
	return count > 0
}

func (b *BaseController) FindWhere(dest interface{}, query interface{}, args ...interface{}) *gorm.DB {
	return db.DB.Where(query, args...).Find(dest)
}

func (b *BaseController) FindOne(dest interface{}, query interface{}, args ...interface{}) *gorm.DB {
	return db.DB.Where(query, args...).First(dest)
} 
package controllers

import (
	"platform/backend/middleware"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BaseController struct{}

func (b *BaseController) GetCurrentUserID(c *gin.Context) (uuid.UUID, bool) {
	return middleware.GetUserID(c)
}

func (b *BaseController) RequireAuthentication(c *gin.Context) (uuid.UUID, bool) {
	userID, ok := b.GetCurrentUserID(c)
	utils.Check(ok)
	utils.Check(userID != uuid.Nil)
	return userID, ok
}

func (b *BaseController) CheckOrganizationAccess(c *gin.Context, orgID uuid.UUID) (uuid.UUID, bool) {
	userID, ok := b.RequireAuthentication(c)
	utils.Check(ok)
	utils.Check(b.CheckOwnership(orgID, userID))
	return userID, ok
}

func (b *BaseController) CheckOwnership(orgID uuid.UUID, userID uuid.UUID) bool {
	isMember, _ := utils.CheckOrganizationMembership(userID, orgID)
	return isMember
} 
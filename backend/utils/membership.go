package utils

import (
	"net/http"
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CheckOrganizationMembership checks if a user is a member of an organization
func CheckOrganizationMembership(userID, organizationID uuid.UUID) (bool, error) {
	var count int64
	err := db.DB.Table("user_organizations").
		Where("organization_id = ? AND user_id = ?", organizationID, userID).
		Count(&count).Error
	
	if err != nil {
		return false, err
	}
	
	return count > 0, nil
}

// RequireOrganizationMembership checks membership and returns error response if not a member
func RequireOrganizationMembership(c *gin.Context, userID, organizationID uuid.UUID) bool {
	isMember, err := CheckOrganizationMembership(userID, organizationID)
	if err != nil {
		ServerErrorResponse(c, err)
		return false
	}
	
	if !isMember {
		ErrorResponse(c, http.StatusConflict, "User is already a member of this organization")
		return false
	}
	
	return true
}

// RequireNotOrganizationMember checks that user is NOT a member and returns error if they are
func RequireNotOrganizationMember(c *gin.Context, userID, organizationID uuid.UUID) bool {
	isMember, err := CheckOrganizationMembership(userID, organizationID)
	if err != nil {
		ServerErrorResponse(c, err)
		return false
	}
	
	if isMember {
		ErrorResponse(c, http.StatusConflict, "User is already a member of this organization")
		return false
	}
	
	return true
}

// CheckProjectAccess checks if a user has access to a project via organization membership
func CheckProjectAccess(userID, projectID uuid.UUID) (bool, error) {
	var count int64
	err := db.DB.Table("projects").
		Joins("JOIN user_organizations ON user_organizations.organization_id = projects.organization_id").
		Where("projects.id = ? AND user_organizations.user_id = ?", projectID, userID).
		Count(&count).Error
	
	if err != nil {
		return false, err
	}
	
	return count > 0, nil
}


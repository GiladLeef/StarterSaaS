package utils

import (
	"net/http"
	"platform/backend/db"
	"platform/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CheckOrganizationMembership checks if a user is a member of an organization
func CheckOrganizationMembership(userID, organizationID uuid.UUID) (bool, error) {
	var membership models.UserOrganization
	err := db.DB.Where("user_id = ? AND organization_id = ?", userID, organizationID).
		First(&membership).Error
	
	if err != nil {
		if err.Error() == "record not found" {
			return false, nil
		}
		return false, err
	}
	
	return true, nil
}

// AddOrganizationMember adds a user to an organization
func AddOrganizationMember(userID, organizationID uuid.UUID) error {
	membership := models.UserOrganization{
		UserID:         userID,
		OrganizationID: organizationID,
	}
	return db.DB.Create(&membership).Error
}

// RemoveOrganizationMember removes a user from an organization
func RemoveOrganizationMember(userID, organizationID uuid.UUID) error {
	return db.DB.Where("user_id = ? AND organization_id = ?", userID, organizationID).
		Delete(&models.UserOrganization{}).Error
}

// RequireOrganizationMembership checks membership and returns error response if not a member
func RequireOrganizationMembership(c *gin.Context, userID, organizationID uuid.UUID) bool {
	isMember, err := CheckOrganizationMembership(userID, organizationID)
	if err != nil {
		ServerErrorResponse(c, err)
		return false
	}
	
	if !isMember {
		ErrorResponse(c, http.StatusForbidden, "You don't have access to this organization")
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

// GetUserOrganizations returns all organizations a user belongs to
func GetUserOrganizations(userID uuid.UUID) ([]models.Organization, error) {
	var organizations []models.Organization
	err := db.DB.
		Joins("JOIN user_organizations ON user_organizations.organization_id = organizations.id").
		Where("user_organizations.user_id = ?", userID).
		Find(&organizations).Error
	
	return organizations, err
}

// CheckProjectAccess checks if a user has access to a project via organization membership
func CheckProjectAccess(userID, projectID uuid.UUID) (bool, error) {
	var project models.Project
	err := db.DB.
		Joins("JOIN user_organizations ON user_organizations.organization_id = projects.organization_id").
		Where("projects.id = ? AND user_organizations.user_id = ?", projectID, userID).
		First(&project).Error
	
	if err != nil {
		if err.Error() == "record not found" {
			return false, nil
		}
		return false, err
	}
	
	return true, nil
}


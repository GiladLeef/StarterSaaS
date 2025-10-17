package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthResult struct {
	UserID uuid.UUID
	OrgID  uuid.UUID
}

type Controller interface {
	GetCurrentUserID(c *gin.Context) (uuid.UUID, bool)
	CheckOwnership(orgID uuid.UUID, userID uuid.UUID) bool
}

func RequireAuthAndOrg(c *gin.Context, ctrl Controller, orgIDStr string) (*AuthResult, bool) {
	userID, ok := ctrl.GetCurrentUserID(c)
	if !ok {
		UnauthorizedResponse(c, "")
		return nil, false
	}

	orgID, err := uuid.Parse(orgIDStr)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid organization ID")
		return nil, false
	}

	if !ctrl.CheckOwnership(orgID, userID) {
		UnauthorizedResponse(c, "You don't have access to this organization")
		return nil, false
	}

	return &AuthResult{UserID: userID, OrgID: orgID}, true
}

func CreateResource(c *gin.Context, model interface{}, resourceName string, statusCode int) {
	if err := CreateDB(model); err != nil {
		ServerErrorResponse(c, err)
		return
	}
	SuccessResponse(c, statusCode, resourceName+" created successfully", gin.H{resourceName: model})
}

func ListResourcesForUser[T any](c *gin.Context, userID uuid.UUID, resourceName string, orgFilter *uuid.UUID) {
	var orgIDs []uuid.UUID
	if err := GetUserOrgIDs(userID, &orgIDs); err != nil {
		ServerErrorResponse(c, err)
		return
	}

	query := BuildOrgQuery(orgIDs, orgFilter)
	
	var resources []T
	if err := query.Find(&resources).Error; err != nil {
		ServerErrorResponse(c, err)
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{resourceName: resources})
}


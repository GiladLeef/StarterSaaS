package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func FetchByParam[T any](c *gin.Context, paramName string) T {
	id := Get(ParseUUID(c, paramName, "resource"))
	return Try(ByID[T](id))
}

func FetchByParamWithOwnership[T interface{ GetOrganizationID() uuid.UUID }](c *gin.Context, paramName string, userID uuid.UUID) T {
	resource := FetchByParam[T](c, paramName)
	isMember := Try(CheckOrganizationMembership(userID, resource.GetOrganizationID()))
	Check(isMember)
	return resource
}


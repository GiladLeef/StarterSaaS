package utils

import (
	"github.com/gin-gonic/gin"
)

func FetchByParam[T any](c *gin.Context, paramName string) T {
	id := Get(ParseUUID(c, paramName, "resource"))
	return Try(ByID[T](id))
}

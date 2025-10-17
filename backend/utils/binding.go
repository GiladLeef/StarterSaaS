package utils

import (
	"github.com/gin-gonic/gin"
)

func BindJSON[T any](c *gin.Context) (*T, bool) {
	return BindAndValidate[T](c)
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


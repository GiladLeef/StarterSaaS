package utils

import (
	"github.com/gin-gonic/gin"
)

func Handle(c *gin.Context, fn func()) {
	Catch(c, fn)
}

func H(c *gin.Context, fn func()) {
	Catch(c, fn)
}


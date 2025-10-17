package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AutoHandler[T any](action string, name string) gin.HandlerFunc {
	return func(c *gin.Context) {
		H(c, func() {
			switch action {
			case "get":
				RestGet[T](c, name)
			case "delete":
				RestDelete[T](c, name)
			case "list":
				items := Try(All[T]())
				RestList[T](c, name+"s", items)
			}
		})
	}
}

func AutoUpdateHandler[T any, R any](name string) gin.HandlerFunc {
	return func(c *gin.Context) {
		H(c, func() {
			RestUpdate[T, R](c, name)
		})
	}
}

func AutoCreate[T any, R any](name string, onCreate func(*R, uuid.UUID) *T) gin.HandlerFunc {
	return func(c *gin.Context) {
		H(c, func() {
			req := BindResource[R](c)
			userID := RequireAuth(c)
			item := onCreate(req, userID)
			RestCreate(c, name, item, StatusCreated)
		})
	}
}

func Crud[T any, CreateReq any, UpdateReq any](
	name string,
	onCreate func(*CreateReq, uuid.UUID) *T,
) map[string]gin.HandlerFunc {
	return map[string]gin.HandlerFunc{
		"list":   AutoHandler[T]("list", name),
		"get":    AutoHandler[T]("get", name),
		"create": AutoCreate[T, CreateReq](name, onCreate),
		"update": AutoUpdateHandler[T, UpdateReq](name),
		"delete": AutoHandler[T]("delete", name),
	}
}

func Route(router *gin.RouterGroup, path string, handlers map[string]gin.HandlerFunc) {
	group := router.Group(path)
	if h, ok := handlers["list"]; ok {
		group.GET("", h)
	}
	if h, ok := handlers["create"]; ok {
		group.POST("", h)
	}
	if h, ok := handlers["get"]; ok {
		group.GET("/:id", h)
	}
	if h, ok := handlers["update"]; ok {
		group.PUT("/:id", h)
	}
	if h, ok := handlers["delete"]; ok {
		group.DELETE("/:id", h)
	}
}


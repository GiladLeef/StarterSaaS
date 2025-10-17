package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type RouteGroup struct {
	router *gin.RouterGroup
}

func NewRouteGroup(r *gin.RouterGroup) RouteGroup {
	return RouteGroup{router: r}
}

func (rg RouteGroup) RegisterCrud(path string, handlers map[string]gin.HandlerFunc) {
	group := rg.router.Group(path)
	
	if list, ok := handlers["list"]; ok {
		group.GET("", list)
	}
	if create, ok := handlers["create"]; ok {
		group.POST("", create)
	}
	if get, ok := handlers["get"]; ok {
		group.GET("/:id", get)
	}
	if update, ok := handlers["update"]; ok {
		group.PUT("/:id", update)
	}
	if delete, ok := handlers["delete"]; ok {
		group.DELETE("/:id", delete)
	}
}

func (rg RouteGroup) Crud(path string, list, create, get, update, delete gin.HandlerFunc) {
	rg.RegisterCrud(path, map[string]gin.HandlerFunc{
		"list":   list,
		"create": create,
		"get":    get,
		"update": update,
		"delete": delete,
	})
}

func AutoCrud[T any, CreateReq any, UpdateReq any](
	router *gin.RouterGroup,
	path string, 
	ctrl CrudController[T, CreateReq, UpdateReq],
	onCreate func(*CreateReq, uuid.UUID) *T,
) {
	group := router.Group(path)
	group.GET("", ctrl.List)
	group.POST("", func(c *gin.Context) { ctrl.Create(c, onCreate) })
	group.GET("/:id", ctrl.Get)
	group.PUT("/:id", ctrl.Update)
	group.DELETE("/:id", ctrl.Delete)
}


package utils

import (
	"reflect"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ResourceConfig struct {
	Name       string
	ModelType  reflect.Type
	CreateType reflect.Type
	UpdateType reflect.Type
	ListFunc   gin.HandlerFunc
	CreateFunc gin.HandlerFunc
	GetFunc    gin.HandlerFunc
	UpdateFunc gin.HandlerFunc
	DeleteFunc gin.HandlerFunc
}

var resourceRegistry = make(map[string]*ResourceConfig)

func RegisterResource[T any, CreateReq any, UpdateReq any](
	name string,
	onCreate func(*CreateReq, uuid.UUID) *T,
) *ResourceConfig {
	var model T
	var create CreateReq
	var update UpdateReq
	
	ctrl := SimpleCrud[T, CreateReq, UpdateReq](name)
	
	config := &ResourceConfig{
		Name:       name,
		ModelType:  reflect.TypeOf(model),
		CreateType: reflect.TypeOf(create),
		UpdateType: reflect.TypeOf(update),
		ListFunc:   ctrl.List,
		GetFunc:    ctrl.Get,
		CreateFunc: func(c *gin.Context) { ctrl.Create(c, onCreate) },
		UpdateFunc: ctrl.Update,
		DeleteFunc: ctrl.Delete,
	}
	
	resourceRegistry[name] = config
	return config
}

func GetResource(name string) *ResourceConfig {
	return resourceRegistry[name]
}

func AllResources() map[string]*ResourceConfig {
	return resourceRegistry
}

func AutoRegisterRoutes(router *gin.RouterGroup) {
	for path, config := range resourceRegistry {
		group := router.Group("/" + path + "s")
		group.GET("", config.ListFunc)
		group.POST("", config.CreateFunc)
		group.GET("/:id", config.GetFunc)
		group.PUT("/:id", config.UpdateFunc)
		group.DELETE("/:id", config.DeleteFunc)
	}
}


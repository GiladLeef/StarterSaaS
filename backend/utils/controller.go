package utils

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CrudController[T any, CreateReq any, UpdateReq any] struct {
	Name string
}

func (ctrl CrudController[T, CreateReq, UpdateReq]) List(c *gin.Context) {
	H(c, func() {
		var items []T
		items = Try(All[T]())
		RestList[T](c, ctrl.Name+"s", items)
	})
}

func (ctrl CrudController[T, CreateReq, UpdateReq]) Get(c *gin.Context) {
	H(c, func() {
		RestGet[T](c, ctrl.Name)
	})
}

func (ctrl CrudController[T, CreateReq, UpdateReq]) Create(c *gin.Context, onCreate func(*CreateReq, uuid.UUID) *T) {
	H(c, func() {
		req := BindResource[CreateReq](c)
		userID := RequireAuth(c)
		item := onCreate(req, userID)
		RestCreate(c, ctrl.Name, item, StatusCreated)
	})
}

func (ctrl CrudController[T, CreateReq, UpdateReq]) Update(c *gin.Context) {
	H(c, func() {
		RestUpdate[T, UpdateReq](c, ctrl.Name)
	})
}

func (ctrl CrudController[T, CreateReq, UpdateReq]) Delete(c *gin.Context) {
	H(c, func() {
		RestDelete[T](c, ctrl.Name)
	})
}

func SimpleCrud[T any, CreateReq any, UpdateReq any](name string) CrudController[T, CreateReq, UpdateReq] {
	return CrudController[T, CreateReq, UpdateReq]{Name: name}
}


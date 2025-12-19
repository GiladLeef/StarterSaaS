package utils

import (
	"github.com/gin-gonic/gin"
)

type RestResource[T any] struct {
	Name string
}

func (r RestResource[T]) Get(c *gin.Context) {
	RestGet[T](c, r.Name)
}

func (r RestResource[T]) List(c *gin.Context, items []T) {
	RestList[T](c, r.Name, items)
}

func (r RestResource[T]) Create(c *gin.Context, item *T) {
	RestCreate[T](c, r.Name, item, StatusCreated)
}

func (r RestResource[T]) Update(c *gin.Context) {
	resource := FetchByParam[T](c, "id")
	TryErr(HandleCRUD(c, "update", &resource, r.Name))
	CrudSuccess(c, "update", r.Name, resource)
}

func (r RestResource[T]) Delete(c *gin.Context) {
	RestDelete[T](c, r.Name)
}

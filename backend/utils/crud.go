package utils

import (
	"github.com/gin-gonic/gin"
)

func RestGet[T any](c *gin.Context, name string) {
	resource := FetchByParam[T](c, "id")
	Respond(c, StatusOK, "", gin.H{name: resource})
}

func RestUpdate[T any, R any](c *gin.Context, name string) {
	resource := FetchByParam[T](c, "id")
	req := Get(BindAndValidate[R](c))
	
	AutoUpdate(&resource, req)
	
	TryErr(HandleCRUD(c, "update", &resource, name))
	CrudSuccess(c, "update", name, resource)
}

func RestDelete[T any](c *gin.Context, name string) {
	resource := FetchByParam[T](c, "id")
	TryErr(HandleCRUD(c, "delete", &resource, name))
	CrudSuccess(c, "delete", name, nil)
}

func RestList[T any](c *gin.Context, name string, items []T) {
	Respond(c, StatusOK, "", gin.H{name: items})
}

func RestCreate[T any](c *gin.Context, name string, item *T, status HTTPStatus) {
	TryErr(HandleCRUD(c, "create", item, name))
	CrudSuccess(c, "create", name, item)
}



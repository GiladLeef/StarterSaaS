package utils

import (
	"platform/backend/db"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

// FindByIDGeneric finds a record by ID for any model type (used with reflection)
func FindByIDGeneric(model interface{}, id uuid.UUID) error {
	return db.DB.First(model, "id = ?", id).Error
}

// SaveGeneric saves a record for any model type (used with reflection)
func SaveGeneric(model interface{}) error {
	return db.DB.Save(model).Error
}

// DeleteByIDGeneric deletes a record by ID for any model type (used with reflection)
func DeleteByIDGeneric(model interface{}, id uuid.UUID) error {
	return db.DB.Delete(model, "id = ?", id).Error
}

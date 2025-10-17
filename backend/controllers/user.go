package controllers

import (
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
)

type UserController struct{}

type UpdateUserRequest struct {
	FirstName fields.FirstName
	LastName  fields.LastName
	Email     fields.Email
}

func (uc *UserController) GetCurrentUser(c *gin.Context) { utils.H(c, func() {
	userID := utils.GetCurrentUserID(c)
	user := utils.Try(utils.ByID[models.User](userID))
	utils.Respond(c, utils.StatusOK, "", utils.ToPublicJSON(user))
})}

func (uc *UserController) UpdateCurrentUser(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[UpdateUserRequest](c))
	userID := utils.GetCurrentUserID(c)
	user := utils.Try(utils.ByID[models.User](userID))
	
	values := utils.ExtractFieldValues(req)
	if email, ok := values["Email"].(string); ok && email != "" && email != user.Email {
		utils.Check(utils.MustNotExistExcept[models.User](c, "Email is already taken", "email", email, userID))
		user.Email = email
	}
	
	utils.AutoUpdate(&user, req)
	
	utils.TryErr(utils.HandleCRUD(c, "update", &user, "user"))
	utils.CrudSuccess(c, "update", "user", utils.ToPublicJSON(user))
})}

func (uc *UserController) DeleteCurrentUser(c *gin.Context) { utils.H(c, func() {
	userID := utils.GetCurrentUserID(c)
	user := utils.Try(utils.ByID[models.User](userID))
	utils.TryErr(utils.HandleCRUD(c, "delete", &user, "user"))
	utils.CrudSuccess(c, "delete", "user", nil)
})}

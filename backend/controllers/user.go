package controllers

import (
	"platform/backend/middleware"
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	BaseController
}

type UpdateUserRequest struct {
	FirstName fields.FirstName
	LastName  fields.LastName
	Email     fields.Email
}

func (uc *UserController) GetCurrentUser(c *gin.Context) { utils.H(c, func() {
	userID := utils.Get(middleware.GetUserID(c))
	user := utils.Try(utils.ByID[models.User](userID))
	utils.Respond(c, utils.StatusOK, "", utils.ToPublicJSON(user))
})}

func (uc *UserController) UpdateCurrentUser(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[UpdateUserRequest](c))
	userID := utils.Get(middleware.GetUserID(c))
	user := utils.Try(utils.ByID[models.User](userID))

	utils.UpdateStringField(&user.FirstName, req.FirstName.Value)
	utils.UpdateStringField(&user.LastName, req.LastName.Value)
	
	if req.Email.Value != "" && req.Email.Value != user.Email {
		utils.Check(utils.MustNotExistExcept[models.User](c, "Email is already taken", "email", req.Email.Value, userID))
		user.Email = req.Email.Value
	}

	utils.Check(utils.HandleCRUD(c, "update", &user, "user"))
	utils.Respond(c, utils.StatusOK, "User updated successfully", gin.H{"user": utils.ToPublicJSON(user)})
})}

func (uc *UserController) DeleteCurrentUser(c *gin.Context) { utils.H(c, func() {
	userID := utils.Get(middleware.GetUserID(c))
	user := utils.Try(utils.ByID[models.User](userID))
	utils.Check(utils.HandleCRUD(c, "delete", &user, "user"))
	utils.Respond(c, utils.StatusOK, "User deleted successfully", nil)
})} 
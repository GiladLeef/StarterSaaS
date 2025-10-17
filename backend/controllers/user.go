package controllers

import (
	"platform/backend/db"
	"platform/backend/middleware"
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"

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

func (uc *UserController) GetCurrentUser(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		utils.Respond(c, utils.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	user, err := utils.Query[models.User]("id = ?", userID)
	if err != nil {
		utils.Respond(c, utils.StatusNotFound, "User not found", nil)
		return
	}

	utils.Respond(c, utils.StatusOK, "", utils.ToPublicJSON(*user))
}

func (uc *UserController) UpdateCurrentUser(c *gin.Context) {
	req, ok := utils.BindAndValidate[UpdateUserRequest](c)
	if !ok {
		return
	}

	userID, ok := middleware.GetUserID(c)
	if !ok {
		utils.Respond(c, utils.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	user, err := utils.Query[models.User]("id = ?", userID)
	if err != nil {
		utils.Respond(c, utils.StatusNotFound, "User not found", nil)
		return
	}

	utils.UpdateStringField(&user.FirstName, req.FirstName.Value)
	utils.UpdateStringField(&user.LastName, req.LastName.Value)
	
	if req.Email.Value != "" && req.Email.Value != user.Email {
		if !utils.MustNotExist[models.User](c, "Email is already taken", "email = ? AND id != ?", req.Email.Value, userID) {
			return
		}
		user.Email = req.Email.Value
	}

	if !utils.HandleCRUD(c, "update", user, "user") {
		return
	}

	utils.Respond(c, utils.StatusOK, "User updated successfully", gin.H{"user": utils.ToPublicJSON(*user)})
}

func (uc *UserController) DeleteCurrentUser(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var user models.User
	if result := db.DB.First(&user, userID); result.Error != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	if result := db.DB.Delete(&user); result.Error != nil {
		utils.ServerErrorResponse(c, result.Error)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User deleted successfully", nil)
} 
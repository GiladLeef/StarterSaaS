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
		utils.UnauthorizedResponse(c, "")
		return
	}

	var user models.User
	if result := db.DB.First(&user, userID); result.Error != nil {
		utils.NotFoundResponse(c, "User not found")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", user.ToPublicJSON())
}

func (uc *UserController) UpdateCurrentUser(c *gin.Context) {
	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

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

	if req.FirstName.Value != "" {
		user.FirstName = req.FirstName.Value
	}
	if req.LastName.Value != "" {
		user.LastName = req.LastName.Value
	}
	if req.Email.Value != "" && req.Email.Value != user.Email {
		var existingUser models.User
		result := db.DB.Where("email = ? AND id != ?", req.Email.Value, userID).First(&existingUser)
		if result.RowsAffected > 0 {
			utils.ErrorResponse(c, http.StatusConflict, "Email is already taken")
			return
		}
		user.Email = req.Email.Value
	}

	if result := db.DB.Save(&user); result.Error != nil {
		utils.ServerErrorResponse(c, result.Error)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User updated successfully", gin.H{"user": user.ToPublicJSON()})
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
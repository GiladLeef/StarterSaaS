package controllers

import (
	"platform/backend/db"
	"platform/backend/middleware"
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UserController handles user-related endpoints
type UserController struct {
	BaseController
}

type UpdateUserRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email" binding:"omitempty,email"`
}

// GetCurrentUser returns the current authenticated user
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

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"isActive":  user.IsActive,
		"role":      user.Role,
	})
}

// UpdateCurrentUser updates the current authenticated user
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

	// Update user fields if provided
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.Email != "" && req.Email != user.Email {
		// Check if email is already taken
		var existingUser models.User
		result := db.DB.Where("email = ? AND id != ?", req.Email, userID).First(&existingUser)
		if result.RowsAffected > 0 {
			utils.ErrorResponse(c, http.StatusConflict, "Email is already taken")
			return
		}
		user.Email = req.Email
	}

	if result := db.DB.Save(&user); result.Error != nil {
		utils.ServerErrorResponse(c, result.Error)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User updated successfully", gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"isActive":  user.IsActive,
		"role":      user.Role,
	})
}

// DeleteCurrentUser deletes the current authenticated user
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

	// Soft delete the user
	if result := db.DB.Delete(&user); result.Error != nil {
		utils.ServerErrorResponse(c, result.Error)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User deleted successfully", nil)
} 
package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"net/http"
	"os"
	"time"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AuthController struct {
	BaseController
}

type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

func (ac *AuthController) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	var existingUser models.User
	result := db.DB.Where("email = ?", req.Email).First(&existingUser)
	if result.RowsAffected > 0 {
		utils.ErrorResponse(c, http.StatusConflict, "User with this email already exists")
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	user := models.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		IsActive:     true,
		Role:         "user",
	}

	if result := db.DB.Create(&user); result.Error != nil {
		utils.ServerErrorResponse(c, result.Error)
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "User registered successfully", gin.H{
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"role":      user.Role,
		},
		"token": token,
	})
}

func (ac *AuthController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		utils.UnauthorizedResponse(c, "Invalid email or password")
		return
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		utils.UnauthorizedResponse(c, "Invalid email or password")
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Login successful", gin.H{
		"token": token,
		"user": gin.H{
			"id":        user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"role":      user.Role,
		},
	})
}

func (ac *AuthController) RefreshToken(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		utils.UnauthorizedResponse(c, "User ID not found in token")
		return
	}

	id, ok := userID.(uuid.UUID)
	if !ok {
		utils.ServerErrorResponse(c, nil)
		return
	}

	token, err := utils.GenerateToken(id)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Token refreshed", gin.H{
		"token": token,
	})
}

func (ac *AuthController) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		utils.SuccessResponse(c, http.StatusOK, "If your email is registered, you will receive a password reset link", nil)
		return
	}

	token := uuid.New().String()

	resetToken := models.PasswordResetToken{
		UserID: user.ID,
		Token:  token,
	}

	if err := db.DB.Create(&resetToken).Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	resetURL := frontendURL + "/reset-password"

	err := utils.SendPasswordResetEmail(user.Email, token, resetURL)
	if err != nil {
		log.Printf("Failed to send password reset email: %v", err)
	}

	utils.SuccessResponse(c, http.StatusOK, "If your email is registered, you will receive a password reset link", nil)
}

func (ac *AuthController) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	var resetToken models.PasswordResetToken
	if err := db.DB.Where("token = ?", req.Token).Preload("User").First(&resetToken).Error; err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid or expired reset token")
		return
	}

	if time.Now().After(resetToken.ExpiresAt) {
		utils.ErrorResponse(c, http.StatusBadRequest, "Reset token has expired")
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		utils.ServerErrorResponse(c, tx.Error)
		return
	}

	if err := tx.Model(&resetToken.User).Update("password_hash", hashedPassword).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	if err := tx.Delete(&resetToken).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	if err := tx.Commit().Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Password reset successful", nil)
} 
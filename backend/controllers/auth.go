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

// AuthController handles authentication endpoints
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

// Register handles user registration
func (ac *AuthController) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	// Check if user already exists
	var existingUser models.User
	result := db.DB.Where("email = ?", req.Email).First(&existingUser)
	if result.RowsAffected > 0 {
		utils.ErrorResponse(c, http.StatusConflict, "User with this email already exists")
		return
	}

	// Hash the password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	// Create the user
	user := models.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		IsActive:     true,
	}

	if result := db.DB.Create(&user); result.Error != nil {
		utils.ServerErrorResponse(c, result.Error)
		return
	}

	// Generate a JWT token
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
		},
		"token": token,
	})
}

// Login handles user authentication
func (ac *AuthController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	// Find the user by email
	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		utils.UnauthorizedResponse(c, "Invalid email or password")
		return
	}

	// Verify the password
	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		utils.UnauthorizedResponse(c, "Invalid email or password")
		return
	}

	// Generate a JWT token
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
		},
	})
}

// RefreshToken handles token refresh
func (ac *AuthController) RefreshToken(c *gin.Context) {
	// Get the user ID from the context (set by auth middleware)
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

	// Generate a new token
	token, err := utils.GenerateToken(id)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Token refreshed", gin.H{
		"token": token,
	})
}

// ForgotPassword handles password reset requests
func (ac *AuthController) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	// Check if user exists
	var user models.User
	result := db.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		// Don't reveal that the user doesn't exist for security reasons
		utils.SuccessResponse(c, http.StatusOK, "If your email is registered, you will receive a password reset link", nil)
		return
	}

	// Generate a unique token
	token := uuid.New().String()

	// Create a password reset token
	resetToken := models.PasswordResetToken{
		UserID: user.ID,
		Token:  token,
		// ExpiresAt will be set automatically in BeforeCreate hook
	}

	// Save the token to the database
	if err := db.DB.Create(&resetToken).Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	// Get the frontend URL from environment
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	// Construct the reset URL
	resetURL := frontendURL + "/reset-password"

	// Send the password reset email
	err := utils.SendPasswordResetEmail(user.Email, token, resetURL)
	if err != nil {
		// Log the error but don't expose it to the user
		log.Printf("Failed to send password reset email: %v", err)
	}

	utils.SuccessResponse(c, http.StatusOK, "If your email is registered, you will receive a password reset link", nil)
}

// ResetPassword handles password reset
func (ac *AuthController) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	// Find the password reset token
	var resetToken models.PasswordResetToken
	if err := db.DB.Where("token = ?", req.Token).Preload("User").First(&resetToken).Error; err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid or expired reset token")
		return
	}

	// Check if the token is expired
	if time.Now().After(resetToken.ExpiresAt) {
		utils.ErrorResponse(c, http.StatusBadRequest, "Reset token has expired")
		return
	}

	// Hash the new password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	// Start a transaction
	tx := db.DB.Begin()
	if tx.Error != nil {
		utils.ServerErrorResponse(c, tx.Error)
		return
	}

	// Update the user's password
	if err := tx.Model(&resetToken.User).Update("password_hash", hashedPassword).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	// Delete the reset token
	if err := tx.Delete(&resetToken).Error; err != nil {
		tx.Rollback()
		utils.ServerErrorResponse(c, err)
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Password reset successful", nil)
} 
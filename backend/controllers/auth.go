package controllers

import (
	"platform/backend/db"
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"net/http"
	"os"
	"time"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthController struct {
	BaseController
}

type RegisterRequest struct {
	Email     fields.Email
	Password  fields.Password
	FirstName fields.FirstName
	LastName  fields.LastName
}

type LoginRequest struct {
	Email    fields.Email
	Password fields.Password
}

type ForgotPasswordRequest struct {
	Email fields.Email
}

type ResetPasswordRequest struct {
	Token    fields.Token
	Password fields.Password
}

func (ac *AuthController) Register(c *gin.Context) {
	req, ok := utils.BindAndValidate[RegisterRequest](c)
	if !ok {
		return
	}

	if !utils.MustNotExist[models.User](c, "User with this email already exists", "email = ?", req.Email.Value) {
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password.Value)
	if err != nil {
		utils.RespondWithError(c, utils.StatusError, err, "Password hashing failed")
		return
	}

	user := models.User{
		Email:        req.Email.Value,
		PasswordHash: hashedPassword,
		FirstName:    req.FirstName.Value,
		LastName:     req.LastName.Value,
		IsActive:     true,
		Role:         "user",
	}

	if !utils.HandleCRUD(c, "create", &user, "user") {
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		utils.RespondWithError(c, utils.StatusError, err, "Token generation failed")
		return
	}

	utils.Respond(c, utils.StatusCreated, "User registered successfully", gin.H{
		"user":  utils.ToPublicJSON(user),
		"token": token,
	})
}

func (ac *AuthController) Login(c *gin.Context) {
	req, ok := utils.BindAndValidate[LoginRequest](c)
	if !ok {
		return
	}

	user, err := utils.Query[models.User]("email = ?", req.Email.Value)
	if err != nil {
		utils.Respond(c, utils.StatusUnauthorized, "Invalid email or password", nil)
		return
	}

	if !utils.CheckPasswordHash(req.Password.Value, user.PasswordHash) {
		utils.Respond(c, utils.StatusUnauthorized, "Invalid email or password", nil)
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		utils.RespondWithError(c, utils.StatusError, err, "Token generation failed")
		return
	}

	utils.Respond(c, utils.StatusOK, "Login successful", gin.H{
		"token": token,
		"user":  utils.ToPublicJSON(*user),
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
	result := db.DB.Where("email = ?", req.Email.Value).First(&user)
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
	if err := db.DB.Where("token = ?", req.Token.Value).Preload("User").First(&resetToken).Error; err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid or expired reset token")
		return
	}

	if time.Now().After(resetToken.ExpiresAt) {
		utils.ErrorResponse(c, http.StatusBadRequest, "Reset token has expired")
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password.Value)
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	if !utils.WithTransaction(c, func(tx *gorm.DB) error {
		if err := tx.Model(&resetToken.User).Update("password_hash", hashedPassword).Error; err != nil {
			return err
		}
		return tx.Delete(&resetToken).Error
	}) {
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Password reset successful", nil)
} 
package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"platform/backend/fields"
	"os"
	"time"

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

func (ac *AuthController) Register(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[RegisterRequest](c))
	utils.Check(utils.MustNotExistBy[models.User](c, "User with this email already exists", "email", req.Email.Value))
	
	hashedPassword := utils.Try(utils.HashPassword(req.Password.Value))
	
	user := models.User{
		Email:        req.Email.Value,
		PasswordHash: hashedPassword,
		FirstName:    req.FirstName.Value,
		LastName:     req.LastName.Value,
		IsActive:     true,
		Role:         "user",
	}

	utils.Check(utils.HandleCRUD(c, "create", &user, "user"))
	token := utils.Try(utils.GenerateToken(user.ID))

	utils.Respond(c, utils.StatusCreated, "User registered successfully", gin.H{
		"user":  utils.ToPublicJSON(user),
		"token": token,
	})
})}

func (ac *AuthController) Login(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[LoginRequest](c))
	user := utils.Try(utils.ByEmail[models.User](req.Email.Value))
	
	if !utils.CheckPasswordHash(req.Password.Value, user.PasswordHash) {
		utils.Respond(c, utils.StatusUnauthorized, "Invalid email or password", nil)
		utils.Abort()
	}

	token := utils.Try(utils.GenerateToken(user.ID))

	utils.Respond(c, utils.StatusOK, "Login successful", gin.H{
		"token": token,
		"user":  utils.ToPublicJSON(user),
	})
})}

func (ac *AuthController) RefreshToken(c *gin.Context) { utils.H(c, func() {
	userID, exists := c.Get("userID")
	utils.Check(exists)
	
	id, ok := userID.(uuid.UUID)
	utils.Check(ok)

	token := utils.Try(utils.GenerateToken(id))
	utils.Respond(c, utils.StatusOK, "Token refreshed", gin.H{"token": token})
})}

func (ac *AuthController) ForgotPassword(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[ForgotPasswordRequest](c))
	successMsg := "If your email is registered, you will receive a password reset link"
	
	user, userErr := utils.ByEmail[models.User](req.Email.Value)
	utils.Check(userErr == nil)

	token := uuid.New().String()
	resetToken := models.PasswordResetToken{
		UserID: user.ID,
		Token:  token,
	}

	utils.Check(utils.HandleCRUD(c, "create", &resetToken, "reset_token"))

	frontendURL := os.Getenv("FRONTEND_URL")
	resetURL := frontendURL + "/reset-password"
	_ = utils.SendPasswordResetEmail(user.Email, token, resetURL)

	utils.Respond(c, utils.StatusOK, successMsg, nil)
})}

func (ac *AuthController) ResetPassword(c *gin.Context) { utils.H(c, func() {
	req := utils.Get(utils.BindAndValidate[ResetPasswordRequest](c))
	resetToken := utils.Try(utils.FindPasswordResetToken(req.Token.Value))

	if time.Now().After(resetToken.ExpiresAt) {
		utils.Respond(c, utils.StatusBadRequest, "Reset token has expired", nil)
		utils.Abort()
	}

	hashedPassword := utils.Try(utils.HashPassword(req.Password.Value))

	utils.Check(utils.Transaction(c, func(tx *gorm.DB) error {
		tx.Model(&resetToken.User).Update("password_hash", hashedPassword)
		return tx.Delete(resetToken).Error
	}))

	utils.Respond(c, utils.StatusOK, "Password reset successful", nil)
})} 
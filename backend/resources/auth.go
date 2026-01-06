package resources

import (
	"platform/backend/config"
	"platform/backend/fields"
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

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

func Register(c *gin.Context) {
	utils.H(c, func() {
		req := utils.Get(utils.BindAndValidate[RegisterRequest](c))
		utils.Check(utils.MustNotExistBy[models.User](c, "User with this email already exists", "email", req.Email.Value))

		hashedPassword := utils.Try(utils.HashPassword(req.Password.Value))

		user := models.User{
			Email:        req.Email.Value,
			PasswordHash: hashedPassword,
			FirstName:    req.FirstName.Value,
			LastName:     req.LastName.Value,
			IsActive:     true,
			Role:         config.RoleUser,
		}

		utils.TryErr(utils.HandleCRUD(c, "create", &user, "user"))
		token := utils.Try(utils.GenerateToken(user.ID))

		utils.Respond(c, utils.StatusCreated, "User registered successfully", gin.H{
			"user":  utils.ToPublicJSON(user),
			"token": token,
		})
	})
}

func Login(c *gin.Context) {
	utils.H(c, func() {
		req := utils.Get(utils.BindAndValidate[LoginRequest](c))
		user := utils.Try(utils.ByEmail[models.User](req.Email.Value))

		if !utils.CheckPasswordHash(req.Password.Value, user.PasswordHash) {
			utils.Respond(c, utils.StatusUnauthorized, "Invalid email or password", nil)
			utils.Abort()
		}

		token := utils.Try(utils.GenerateToken(user.ID))
		utils.Respond(c, utils.StatusOK, "Login successful", gin.H{
			"user":  utils.ToPublicJSON(user),
			"token": token,
		})
	})
}

func RefreshToken(c *gin.Context) {
	utils.H(c, func() {
		userID, exists := c.Get("userID")
		utils.Check(exists)

		id, ok := userID.(uuid.UUID)
		utils.Check(ok)

		token := utils.Try(utils.GenerateToken(id))
		utils.Respond(c, utils.StatusOK, "Token refreshed", gin.H{"token": token})
	})
}

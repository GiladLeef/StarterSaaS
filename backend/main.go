package main

import (
	"platform/backend/config"
	"platform/backend/db"
	"platform/backend/routes"
	"platform/backend/models"
	"platform/backend/utils"

	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	if err := db.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	if err := db.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	adminEmail := os.Getenv("ADMIN_EMAIL")
	adminPassword := os.Getenv("ADMIN_PASSWORD")
	adminFirstName := os.Getenv("ADMIN_FIRST_NAME")
	adminLastName := os.Getenv("ADMIN_LAST_NAME")
	if adminEmail != "" {
		var count int64
		db.DB.Model(&models.User{}).Where("email = ?", adminEmail).Count(&count)
		if count == 0 {
			hashedPassword, err := utils.HashPassword(adminPassword)
			if err != nil {
				return
			}
			admin := models.User{
				Email:        adminEmail,
				PasswordHash: hashedPassword,
				FirstName:    adminFirstName,
				LastName:     adminLastName,
				IsActive:     true,
				Role:         "admin",
			}
			_ = db.DB.Create(&admin).Error
		}
	}

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.RedirectTrailingSlash = false 

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           86400, 
	}))

	routes.SetupRoutes(r)

	port := os.Getenv("PORT")

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
} 
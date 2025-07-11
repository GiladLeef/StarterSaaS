package main

import (
	"platform/backend/config"
	"platform/backend/db"
	"platform/backend/routes"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Initialize database
	if err := db.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Run database migrations
	if err := db.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Create admin user if not exists
	adminEmail := os.Getenv("ADMIN_EMAIL")
	adminPassword := os.Getenv("ADMIN_PASSWORD")
	adminFirstName := os.Getenv("ADMIN_FIRST_NAME")
	adminLastName := os.Getenv("ADMIN_LAST_NAME")
	if adminEmail != "" && adminPassword != "" {
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

	// Initialize Gin router
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.RedirectTrailingSlash = false // Disable automatic redirects

	// Configure CORS - allow any origin for development
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	}))

	// Setup routes
	routes.SetupRoutes(r)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
} 
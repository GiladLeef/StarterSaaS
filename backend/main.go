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
	defer func() {
		if r := recover(); r != nil {
			log.Fatalf("Fatal error: %v", r)
		}
	}()

	utils.TryErr(config.LoadEnv())
	utils.TryErr(db.InitDB())
	utils.TryErr(db.RunMigrations())

	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail != "" {
		if !utils.ExistsBy[models.User]("email", adminEmail) {
			hashedPassword := utils.Try(utils.HashPassword(os.Getenv("ADMIN_PASSWORD")))
			
			admin := models.User{
				Email:        adminEmail,
				PasswordHash: hashedPassword,
				FirstName:    os.Getenv("ADMIN_FIRST_NAME"),
				LastName:     os.Getenv("ADMIN_LAST_NAME"),
				IsActive:     true,
				Role:         "admin",
			}
			
			utils.TryErr(utils.HandleCRUD(nil, "create", &admin, "admin"))
			log.Printf("Admin user created successfully: %s", adminEmail)
		} else {
			log.Printf("Admin user already exists: %s", adminEmail)
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
	utils.TryErr(r.Run(":" + port))
}

package db

import (
	"platform/backend/models"
	"log"
)

// RunMigrations handles database schema migrations using GORM's AutoMigrate
func RunMigrations() error {
	log.Println("Running database migrations...")

	// Register your models here for automatic migrations
	// This will automatically create tables, constraints, and relationships
	err := DB.AutoMigrate(
		&models.User{},
		&models.Organization{},
		&models.Project{},
		&models.Subscription{},
		&models.ApiKey{},
		&models.OrganizationInvitation{},
		&models.PasswordResetToken{},
	)

	if err != nil {
		return err
	}

	log.Println("Migrations completed successfully")
	return nil
} 
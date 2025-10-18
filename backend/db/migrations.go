package db

import (
	"platform/backend/models"
	"log"
)

func RunMigrations() error {
	log.Println("Running database migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Organization{},
		&models.Project{},
		&models.Subscription{},
		&models.OrganizationInvitation{},
		&models.PasswordResetToken{},
		&models.Plan{},
		&models.PlanFeature{},
		&models.Setting{},
	)

	if err != nil {
		return err
	}

	log.Println("Migrations completed successfully")
	return nil
} 
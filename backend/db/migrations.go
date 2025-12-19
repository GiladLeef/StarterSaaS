package db

import (
	"log"
	"platform/backend/models"
)

func RunMigrations() error {
	log.Println("Running database migrations...")

	err := DB.AutoMigrate(
		&models.User{},

		&models.PasswordResetToken{},
		&models.Setting{},
	)

	if err != nil {
		return err
	}

	log.Println("Migrations completed successfully")
	return nil
}

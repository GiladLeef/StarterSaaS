package db

import (
	"platform/backend/config"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB *gorm.DB
)

func InitDB() error {
	dsn, err := config.GetDatabase()
	if err != nil {
		return fmt.Errorf("failed to get database DSN: %v", err)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	DB = db

	log.Printf("Connected to PostgreSQL database")
	return nil
}

func GetDB() *gorm.DB {
	return DB
} 
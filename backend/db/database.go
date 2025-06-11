package db

import (
	"platform/backend/config"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB *gorm.DB
)

// InitDB initializes the database connection
func InitDB() error {
	// Get database path from config
	dbPath := config.GetDBPath()

	// Ensure the directory for the database exists
	if dir := filepath.Dir(dbPath); dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("failed to create database directory: %v", err)
		}
	}

	// Connect to the SQLite database
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	// Set the global DB variable
	DB = db

	log.Printf("Connected to database at %s", dbPath)
	return nil
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	return DB
} 
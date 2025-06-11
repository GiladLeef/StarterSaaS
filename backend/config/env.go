package config

import (
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

// LoadEnv loads environment variables from .env file
func LoadEnv() error {
	// Try to load .env file if it exists
	if _, err := os.Stat(".env"); err == nil {
		return godotenv.Load()
	}
	return nil
}

// GetDBPath returns the database path from environment or default
func GetDBPath() string {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		// Default to data directory in current directory
		dataDir := filepath.Join(".", "data")
		if err := os.MkdirAll(dataDir, 0755); err != nil {
			return "platform.db"
		}
		return filepath.Join(dataDir, "platform.db")
	}
	return dbPath
}

// GetMigrationsPath returns the path to database migrations
func GetMigrationsPath() string {
	migrationsPath := os.Getenv("MIGRATIONS_PATH")
	if migrationsPath == "" {
		return filepath.Join(".", "db", "migrations")
	}
	return migrationsPath
} 
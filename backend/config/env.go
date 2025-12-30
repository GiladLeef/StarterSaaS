package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() error {
	if _, err := os.Stat(".env"); err == nil {
		return godotenv.Load()
	}
	return nil
}

func GetDatabaseDSN() (string, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn != "" {
		return dsn, nil
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		return "", fmt.Errorf("DB_HOST environment variable is required")
	}

	port := os.Getenv("DB_PORT")
	if port == "" {
		return "", fmt.Errorf("DB_PORT environment variable is required")
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		return "", fmt.Errorf("DB_USER environment variable is required")
	}

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		return "", fmt.Errorf("DB_PASSWORD environment variable is required")
	}

	dbname := os.Getenv("DB_NAME")
	if dbname == "" {
		return "", fmt.Errorf("DB_NAME environment variable is required")
	}

	sslmode := os.Getenv("DB_SSLMODE")
	if sslmode == "" {
		return "", fmt.Errorf("DB_SSLMODE environment variable is required")
	}

	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode), nil
}

func GetMigrationsPath() string {
	return os.Getenv("MIGRATIONS_PATH")
}

func GetGeminiKey() string {
	return os.Getenv("GEMINI_API_KEY")
}
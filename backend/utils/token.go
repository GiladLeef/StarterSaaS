package utils

import (
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type TokenClaims struct {
	UserID uuid.UUID `json:"userId"`
	jwt.RegisteredClaims
}

// GenerateToken creates a new JWT token for a user
func GenerateToken(userID uuid.UUID) (string, error) {
	secret := getJWTSecret()
	expiry := getJWTExpiry()
	
	claims := TokenClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken validates a JWT token and returns the user ID
func ValidateToken(tokenString string) (uuid.UUID, error) {
	secret := getJWTSecret()
	log.Printf("Validating token: %s...", tokenString[:20])

	token, err := jwt.ParseWithClaims(tokenString, &TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Printf("Unexpected signing method: %v", token.Header["alg"])
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		log.Printf("Token validation error: %v", err)
		return uuid.Nil, err
	}

	if claims, ok := token.Claims.(*TokenClaims); ok && token.Valid {
		log.Printf("Token validated successfully for user: %s", claims.UserID)
		return claims.UserID, nil
	}

	log.Printf("Invalid token structure")
	return uuid.Nil, errors.New("invalid token")
}

// getJWTSecret returns the JWT secret from environment variables
func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "default-jwt-secret-key-change-in-production"
	}
	return secret
}

// getJWTExpiry returns the JWT expiry duration from environment variables
func getJWTExpiry() time.Duration {
	expiryStr := os.Getenv("JWT_EXPIRY")
	if expiryStr == "" {
		return 24 * time.Hour // Default to 24 hours
	}

	expiry, err := time.ParseDuration(expiryStr)
	if err != nil {
		return 24 * time.Hour // Default to 24 hours on error
	}

	return expiry
} 
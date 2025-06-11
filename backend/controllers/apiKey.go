package controllers

import (
	"platform/backend/models"
	"platform/backend/utils"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ApiKeyController handles API key endpoints
type ApiKeyController struct {
	BaseController
}

type CreateApiKeyRequest struct {
	Name        string `json:"name" binding:"required"`
	Permissions string `json:"permissions" binding:"required"`
	ExpiresIn   int    `json:"expiresIn"` // In days, 0 means no expiration
}

// ListApiKeys returns a list of API keys for the current user
func (akc *ApiKeyController) ListApiKeys(c *gin.Context) {
	userID, ok := akc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var apiKeys []models.ApiKey
	if err := akc.FindWhere(&apiKeys, "user_id = ?", userID).Error; err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", gin.H{"apiKeys": apiKeys})
}

// CreateApiKey creates a new API key
func (akc *ApiKeyController) CreateApiKey(c *gin.Context) {
	var req CreateApiKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	userID, ok := akc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	// Generate a random API key
	key, prefix, err := generateApiKey()
	if err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	// Calculate expiry date if needed
	var expiresAt *time.Time
	if req.ExpiresIn > 0 {
		exp := time.Now().Add(time.Duration(req.ExpiresIn) * 24 * time.Hour)
		expiresAt = &exp
	}

	// Create the API key
	apiKey := models.ApiKey{
		UserID:      userID,
		Name:        req.Name,
		Key:         key,
		KeyPrefix:   prefix,
		Permissions: req.Permissions,
		ExpiresAt:   expiresAt,
		IsActive:    true,
	}

	if err := akc.Create(&apiKey); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	// Return the full key only once
	apiKey.Key = key
	utils.SuccessResponse(c, http.StatusCreated, "API key created successfully", gin.H{"apiKey": apiKey})
}

// DeleteApiKey deletes an API key
func (akc *ApiKeyController) DeleteApiKey(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid API key ID")
		return
	}

	userID, ok := akc.GetCurrentUserID(c)
	if !ok {
		utils.UnauthorizedResponse(c, "")
		return
	}

	var apiKey models.ApiKey
	if err := akc.FindOne(&apiKey, "id = ? AND user_id = ?", id, userID).Error; err != nil {
		utils.NotFoundResponse(c, "API key not found or you don't have permission to delete it")
		return
	}

	if err := akc.Delete(&apiKey); err != nil {
		utils.ServerErrorResponse(c, err)
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "API key deleted successfully", nil)
}

// generateApiKey generates a random API key and its prefix
func generateApiKey() (string, string, error) {
	// Generate 32 bytes of random data
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", "", err
	}
	
	key := "sk_" + hex.EncodeToString(bytes)
	prefix := key[:16] // Use first 16 characters as prefix
	
	return key, prefix, nil
} 
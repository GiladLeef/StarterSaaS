package utils

import (
	"errors"
	"platform/backend/models"
	"regexp"

	"gorm.io/gorm"
)

// SettingsService provides DRY methods for user settings operations
type SettingsService struct {
	DB *gorm.DB
}

// UpdateProfileRequest represents a profile update with validation
type UpdateProfileRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

// Validate performs validation on profile update request
func (req *UpdateProfileRequest) Validate() error {
	if req.FirstName == "" {
		return errors.New("first name is required")
	}
	if req.LastName == "" {
		return errors.New("last name is required")
	}
	if req.Email == "" {
		return errors.New("email is required")
	}

	// Validate email format
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(req.Email) {
		return errors.New("invalid email format")
	}

	return nil
}

// UpdateProfile updates user profile with DRY validation logic
func (ss *SettingsService) UpdateProfile(user *models.User, req *UpdateProfileRequest) error {
	if err := req.Validate(); err != nil {
		return err
	}

	// Check if email is already taken by another user
	var existingUser models.User
	err := ss.DB.Where("email = ? AND id != ?", req.Email, user.ID).First(&existingUser).Error
	if err == nil {
		return errors.New("email already in use")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// Update user fields
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Email = req.Email

	return ss.DB.Save(user).Error
}

// ChangePasswordRequest represents a password change request
type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

// Validate performs validation on password change request
func (req *ChangePasswordRequest) Validate() error {
	if req.CurrentPassword == "" {
		return errors.New("current password is required")
	}
	if req.NewPassword == "" {
		return errors.New("new password is required")
	}
	if len(req.NewPassword) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	return nil
}

// ChangePassword changes user password with DRY validation logic
func (ss *SettingsService) ChangePassword(user *models.User, req *ChangePasswordRequest) error {
	if err := req.Validate(); err != nil {
		return err
	}

	// Verify current password
	if !CheckPasswordHash(req.CurrentPassword, user.PasswordHash) {
		return errors.New("current password is incorrect")
	}

	// Hash new password
	hashedPassword, err := HashPassword(req.NewPassword)
	if err != nil {
		return err
	}

	// Update password
	user.PasswordHash = hashedPassword
	return ss.DB.Save(user).Error
}

// NotificationPreferences represents user notification settings
type NotificationPreferences struct {
	EmailNotifications    bool `json:"emailNotifications"`
	ProjectUpdates        bool `json:"projectUpdates"`
	OrganizationInvites   bool `json:"organizationInvites"`
	SecurityAlerts        bool `json:"securityAlerts"`
	MarketingEmails       bool `json:"marketingEmails"`
}

// DefaultNotificationPreferences returns default notification settings
func DefaultNotificationPreferences() *NotificationPreferences {
	return &NotificationPreferences{
		EmailNotifications:  true,
		ProjectUpdates:      true,
		OrganizationInvites: true,
		SecurityAlerts:      true,
		MarketingEmails:     false,
	}
}

// AppearancePreferences represents user appearance settings
type AppearancePreferences struct {
	Theme    string `json:"theme"`     // "light", "dark", "system"
	Language string `json:"language"`  // "en", "es", "fr", etc.
	Timezone string `json:"timezone"`  // IANA timezone
}

// DefaultAppearancePreferences returns default appearance settings
func DefaultAppearancePreferences() *AppearancePreferences {
	return &AppearancePreferences{
		Theme:    "system",
		Language: "en",
		Timezone: "UTC",
	}
}


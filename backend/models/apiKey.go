package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ApiKey struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	UserID      uuid.UUID      `gorm:"type:uuid;not null" json:"userId"`
	User        User           `json:"user,omitempty"`
	Name        string         `json:"name"`
	Key         string         `gorm:"unique;not null" json:"-"`
	KeyPrefix   string         `gorm:"unique;not null" json:"keyPrefix"`
	LastUsed    *time.Time     `json:"lastUsed"`
	ExpiresAt   *time.Time     `json:"expiresAt"`
	Permissions string         `json:"permissions"`
	IsActive    bool           `gorm:"default:true" json:"isActive"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (a *ApiKey) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
} 
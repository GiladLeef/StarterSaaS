package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PasswordResetToken struct {
	BaseModel
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"userId"`
	User      User      `json:"user,omitempty"`
	Token     string    `gorm:"not null;unique" json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
}

func (p *PasswordResetToken) BeforeCreate(tx *gorm.DB) error {
	// Call parent BeforeCreate for UUID generation
	if p.ID == uuid.Nil {
		p.BaseModel.BeforeCreate(tx)
	}
	
	// Set expiration if not set
	if p.ExpiresAt.IsZero() {
		p.ExpiresAt = time.Now().Add(1 * time.Hour)
	}
	
	return nil
} 
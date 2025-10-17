package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationInvitation struct {
	BaseModel
	OrganizationID uuid.UUID    `gorm:"type:uuid;not null" json:"organizationId"`
	Organization   Organization `json:"organization,omitempty"`
	InviterID      uuid.UUID    `gorm:"type:uuid;not null" json:"inviterId"`
	Inviter        User         `json:"inviter,omitempty"`
	Email          string       `gorm:"not null" json:"email"`
	Status         string       `gorm:"default:'pending'" json:"status"`
	ExpiresAt      time.Time    `json:"expiresAt"`
}

func (i *OrganizationInvitation) BeforeCreate(tx *gorm.DB) error {
	// Call parent BeforeCreate for UUID generation
	if i.ID == uuid.Nil {
		i.BaseModel.BeforeCreate(tx)
	}
	
	// Set expiration if not set
	if i.ExpiresAt.IsZero() {
		i.ExpiresAt = time.Now().AddDate(0, 0, 7)
	}
	
	return nil
} 
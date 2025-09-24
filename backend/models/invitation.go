package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrganizationInvitation struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	OrganizationID uuid.UUID      `gorm:"type:uuid;not null" json:"organizationId"`
	Organization   Organization   `json:"organization,omitempty"`
	InviterID      uuid.UUID      `gorm:"type:uuid;not null" json:"inviterId"`
	Inviter        User           `json:"inviter,omitempty"`
	Email          string         `gorm:"not null" json:"email"`
	Status         string         `gorm:"default:'pending'" json:"status"` 
	ExpiresAt      time.Time      `json:"expiresAt"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

func (i *OrganizationInvitation) BeforeCreate(tx *gorm.DB) error {
	if i.ID == uuid.Nil {
		i.ID = uuid.New()
	}
	
	if i.ExpiresAt.IsZero() {
		i.ExpiresAt = time.Now().AddDate(0, 0, 7)
	}
	
	return nil
} 
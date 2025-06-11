package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Project struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Name           string         `gorm:"not null" json:"name"`
	Description    string         `json:"description"`
	OrganizationID uuid.UUID      `gorm:"type:uuid;not null" json:"organizationId"`
	Organization   Organization   `json:"organization,omitempty"`
	Status         string         `gorm:"default:'active'" json:"status"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

func (p *Project) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
} 
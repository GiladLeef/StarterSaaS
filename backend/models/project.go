package models

import (
	"github.com/google/uuid"
)

type Project struct {
	BaseModel
	Name           string       `gorm:"not null" json:"name"`
	Description    string       `json:"description"`
	OrganizationID uuid.UUID    `gorm:"type:uuid;not null" json:"organizationId"`
	Organization   Organization `json:"organization,omitempty"`
	Status         string       `gorm:"default:'active'" json:"status"`
} 
package models

import (
	"time"

	"github.com/google/uuid"
)

type Setting struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Key       string    `json:"key" gorm:"uniqueIndex;not null"`
	Value     string    `json:"value"`
	Category  string    `json:"category" gorm:"default:'general'"`
	IsPublic  bool      `json:"isPublic" gorm:"default:false"`
}


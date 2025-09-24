package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Email        string         `gorm:"unique;not null" json:"email"`
	PasswordHash string         `gorm:"not null" json:"-"`
	FirstName    string         `json:"firstName"`
	LastName     string         `json:"lastName"`
	IsActive     bool           `gorm:"default:true" json:"isActive"`
	Role         string         `gorm:"type:varchar(16);default:'user'" json:"role"`
	Organizations []Organization `gorm:"many2many:user_organizations;" json:"organizations,omitempty"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
} 
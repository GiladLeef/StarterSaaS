package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Subscription struct {
	ID             uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	OrganizationID uuid.UUID      `gorm:"type:uuid;not null" json:"organizationId"`
	Organization   Organization   `json:"organization,omitempty"`
	PlanName       string         `gorm:"not null" json:"planName"`
	Status         string         `gorm:"default:'active'" json:"status"`
	BillingPeriod  string         `gorm:"default:'monthly'" json:"billingPeriod"`
	StartDate      time.Time      `json:"startDate"`
	EndDate        time.Time      `json:"endDate"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

func (s *Subscription) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
} 
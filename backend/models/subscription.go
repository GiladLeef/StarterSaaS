package models

import (
	"time"

	"github.com/google/uuid"
)

type Subscription struct {
	BaseModel
	OrganizationID       uuid.UUID    `gorm:"type:uuid;not null" json:"organizationId"`
	Organization         Organization `json:"organization,omitempty"`
	PlanName             string       `gorm:"not null" json:"planName"`
	Status               string       `gorm:"default:'active'" json:"status"`
	BillingPeriod        string       `gorm:"default:'monthly'" json:"billingPeriod"`
	StartDate            time.Time    `json:"startDate"`
	EndDate              time.Time    `json:"endDate"`
	StripeSubscriptionID string       `gorm:"index" json:"stripeSubscriptionId,omitempty"`
	StripeCustomerID     string       `gorm:"index" json:"stripeCustomerId,omitempty"`
} 
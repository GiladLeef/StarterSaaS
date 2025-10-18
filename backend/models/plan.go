package models

import (
	"time"

	"github.com/google/uuid"
)

type Plan struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Name                   string  `json:"name" gorm:"uniqueIndex;not null"`
	DisplayName            string  `json:"displayName" gorm:"not null"`
	Description            string  `json:"description"`
	MonthlyPrice           float64 `json:"monthlyPrice" gorm:"not null"`
	YearlyPrice            float64 `json:"yearlyPrice" gorm:"not null"`
	StripePriceIDMonthly   string  `json:"stripePriceIdMonthly"`
	StripePriceIDYearly    string  `json:"stripePriceIdYearly"`
	MaxOrganizations       int     `json:"maxOrganizations" gorm:"default:-1"`
	MaxProjects            int     `json:"maxProjects" gorm:"default:-1"`
	MaxMembers             int     `json:"maxMembers" gorm:"default:-1"`
	HasPrioritySupport     bool    `json:"hasPrioritySupport" gorm:"default:false"`
	HasAdvancedFeatures    bool    `json:"hasAdvancedFeatures" gorm:"default:false"`
	HasCustomIntegrations  bool    `json:"hasCustomIntegrations" gorm:"default:false"`
	IsActive               bool    `json:"isActive" gorm:"default:true"`
	SortOrder              int     `json:"sortOrder" gorm:"default:0"`
}

type PlanFeature struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	PlanID      uuid.UUID `json:"planId" gorm:"not null;index"`
	Plan        Plan      `json:"plan" gorm:"foreignKey:PlanID"`
	FeatureName string    `json:"featureName" gorm:"not null"`
	IsIncluded  bool      `json:"isIncluded" gorm:"default:true"`
	Limit       int       `json:"limit" gorm:"default:-1"`
}


package utils

import (
	"platform/backend/config"
	"platform/backend/models"
	"time"

	"github.com/google/uuid"
)

// BillingService provides DRY methods for billing operations
type BillingService struct{}

// PlanPrices maps plan names to their monthly prices
var PlanPrices = map[string]float64{
	config.PlanFree:       0,
	config.PlanPro:        29,
	config.PlanEnterprise: 99,
}

// PlanFeatures maps plan names to their feature limits
type PlanLimits struct {
	MaxOrganizations int
	MaxProjects      int
	MaxMembers       int
	HasPrioritySupport bool
	HasAdvancedFeatures bool
	HasCustomIntegrations bool
}

var PlanFeatureLimits = map[string]PlanLimits{
	config.PlanFree: {
		MaxOrganizations:      1,
		MaxProjects:           3,
		MaxMembers:            3,
		HasPrioritySupport:    false,
		HasAdvancedFeatures:   false,
		HasCustomIntegrations: false,
	},
	config.PlanPro: {
		MaxOrganizations:      -1, // unlimited
		MaxProjects:           -1,
		MaxMembers:            -1,
		HasPrioritySupport:    true,
		HasAdvancedFeatures:   true,
		HasCustomIntegrations: true,
	},
	config.PlanEnterprise: {
		MaxOrganizations:      -1,
		MaxProjects:           -1,
		MaxMembers:            -1,
		HasPrioritySupport:    true,
		HasAdvancedFeatures:   true,
		HasCustomIntegrations: true,
	},
}

// CreateSubscription creates a new subscription with DRY logic
func (bs *BillingService) CreateSubscription(orgID uuid.UUID, planName string, billingPeriod string) (*models.Subscription, error) {
	now := time.Now()
	var endDate time.Time
	
	if billingPeriod == "monthly" {
		endDate = now.AddDate(0, 1, 0)
	} else if billingPeriod == "yearly" {
		endDate = now.AddDate(1, 0, 0)
	} else {
		endDate = now.AddDate(0, 1, 0) // default to monthly
	}

	subscription := &models.Subscription{
		OrganizationID: orgID,
		PlanName:       planName,
		Status:         config.StatusActive,
		BillingPeriod:  billingPeriod,
		StartDate:      now,
		EndDate:        endDate,
	}

	return subscription, nil
}

// CanAccessFeature checks if a subscription allows access to a feature
func (bs *BillingService) CanAccessFeature(subscription *models.Subscription, feature string) bool {
	if subscription == nil || subscription.Status != config.StatusActive {
		return false
	}

	limits, exists := PlanFeatureLimits[subscription.PlanName]
	if !exists {
		return false
	}

	switch feature {
	case "priority_support":
		return limits.HasPrioritySupport
	case "advanced_features":
		return limits.HasAdvancedFeatures
	case "custom_integrations":
		return limits.HasCustomIntegrations
	default:
		return false
	}
}

// CheckLimit verifies if an action is within subscription limits
func (bs *BillingService) CheckLimit(subscription *models.Subscription, limitType string, currentCount int) bool {
	if subscription == nil {
		return false
	}

	limits, exists := PlanFeatureLimits[subscription.PlanName]
	if !exists {
		return false
	}

	var limit int
	switch limitType {
	case "organizations":
		limit = limits.MaxOrganizations
	case "projects":
		limit = limits.MaxProjects
	case "members":
		limit = limits.MaxMembers
	default:
		return false
	}

	// -1 means unlimited
	if limit == -1 {
		return true
	}

	return currentCount < limit
}

// IsSubscriptionActive checks if subscription is active and not expired
func (bs *BillingService) IsSubscriptionActive(subscription *models.Subscription) bool {
	if subscription == nil {
		return false
	}

	if subscription.Status != config.StatusActive {
		return false
	}

	return time.Now().Before(subscription.EndDate)
}

// GetSubscriptionStatus returns a user-friendly status
func (bs *BillingService) GetSubscriptionStatus(subscription *models.Subscription) string {
	if subscription == nil {
		return "none"
	}

	if !bs.IsSubscriptionActive(subscription) {
		return "expired"
	}

	return subscription.Status
}


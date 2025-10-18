package utils

import (
	"platform/backend/config"
	"platform/backend/db"
	"platform/backend/models"
	"time"

	"github.com/google/uuid"
)

// BillingService provides DRY methods for billing operations
type BillingService struct{}

// GetPlanFromDB retrieves plan details from database
func (bs *BillingService) GetPlanFromDB(planName string) (*models.Plan, error) {
	var plan models.Plan
	err := db.DB.Where("name = ? AND is_active = ?", planName, true).First(&plan).Error
	return &plan, err
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

	plan, err := bs.GetPlanFromDB(subscription.PlanName)
	if err != nil {
		return false
	}

	switch feature {
	case "priority_support":
		return plan.HasPrioritySupport
	case "advanced_features":
		return plan.HasAdvancedFeatures
	case "custom_integrations":
		return plan.HasCustomIntegrations
	default:
		return false
	}
}

// CheckLimit verifies if an action is within subscription limits
func (bs *BillingService) CheckLimit(subscription *models.Subscription, limitType string, currentCount int) bool {
	if subscription == nil {
		return false
	}

	plan, err := bs.GetPlanFromDB(subscription.PlanName)
	if err != nil {
		return false
	}

	var limit int
	switch limitType {
	case "organizations":
		limit = plan.MaxOrganizations
	case "projects":
		limit = plan.MaxProjects
	case "members":
		limit = plan.MaxMembers
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


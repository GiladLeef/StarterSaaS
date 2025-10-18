package resources

import (
	"platform/backend/models"
	"platform/backend/utils"

	"github.com/google/uuid"
)

type CreatePlanRequest struct {
	Name                  string  `json:"name" binding:"required"`
	DisplayName           string  `json:"displayName" binding:"required"`
	Description           string  `json:"description"`
	MonthlyPrice          float64 `json:"monthlyPrice"`
	YearlyPrice           float64 `json:"yearlyPrice"`
	StripePriceIDMonthly  string  `json:"stripePriceIdMonthly"`
	StripePriceIDYearly   string  `json:"stripePriceIdYearly"`
	MaxOrganizations      int     `json:"maxOrganizations"`
	MaxProjects           int     `json:"maxProjects"`
	MaxMembers            int     `json:"maxMembers"`
	HasPrioritySupport    bool    `json:"hasPrioritySupport"`
	HasAdvancedFeatures   bool    `json:"hasAdvancedFeatures"`
	HasCustomIntegrations bool    `json:"hasCustomIntegrations"`
	IsActive              bool    `json:"isActive"`
	SortOrder             int     `json:"sortOrder"`
}

type UpdatePlanRequest struct {
	DisplayName           *string  `json:"displayName"`
	Description           *string  `json:"description"`
	MonthlyPrice          *float64 `json:"monthlyPrice"`
	YearlyPrice           *float64 `json:"yearlyPrice"`
	StripePriceIDMonthly  *string  `json:"stripePriceIdMonthly"`
	StripePriceIDYearly   *string  `json:"stripePriceIdYearly"`
	MaxOrganizations      *int     `json:"maxOrganizations"`
	MaxProjects           *int     `json:"maxProjects"`
	MaxMembers            *int     `json:"maxMembers"`
	HasPrioritySupport    *bool    `json:"hasPrioritySupport"`
	HasAdvancedFeatures   *bool    `json:"hasAdvancedFeatures"`
	HasCustomIntegrations *bool    `json:"hasCustomIntegrations"`
	IsActive              *bool    `json:"isActive"`
	SortOrder             *int     `json:"sortOrder"`
}

func createPlanFactory(req *CreatePlanRequest, userID uuid.UUID) *models.Plan {
	return &models.Plan{
		Name:                  req.Name,
		DisplayName:           req.DisplayName,
		Description:           req.Description,
		MonthlyPrice:          req.MonthlyPrice,
		YearlyPrice:           req.YearlyPrice,
		StripePriceIDMonthly:  req.StripePriceIDMonthly,
		StripePriceIDYearly:   req.StripePriceIDYearly,
		MaxOrganizations:      req.MaxOrganizations,
		MaxProjects:           req.MaxProjects,
		MaxMembers:            req.MaxMembers,
		HasPrioritySupport:    req.HasPrioritySupport,
		HasAdvancedFeatures:   req.HasAdvancedFeatures,
		HasCustomIntegrations: req.HasCustomIntegrations,
		IsActive:              req.IsActive,
		SortOrder:             req.SortOrder,
	}
}

var PlanHandlers = utils.Crud[models.Plan, CreatePlanRequest, UpdatePlanRequest](
	"plan",
	createPlanFactory,
)


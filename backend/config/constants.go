package config

// Status constants
const (
	StatusActive    = "active"
	StatusInactive  = "inactive"
	StatusPending   = "pending"
	StatusCompleted = "completed"
	StatusCancelled = "cancelled"
)

// Role constants
const (
	RoleUser  = "user"
	RoleAdmin = "admin"
)

// Subscription plan constants
const (
	PlanFree       = "free"
	PlanPro        = "pro"
	PlanEnterprise = "enterprise"
)

// Billing period constants
const (
	BillingMonthly = "monthly"
	BillingYearly  = "yearly"
)

// Default values
const (
	DefaultProjectStatus = StatusActive
	DefaultUserRole      = RoleUser
	DefaultPlan          = PlanFree
	DefaultBillingPeriod = BillingMonthly
)


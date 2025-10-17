package models

import "github.com/google/uuid"

// UserOrganization represents the many-to-many relationship between users and organizations
type UserOrganization struct {
	UserID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"userId"`
	OrganizationID uuid.UUID `gorm:"type:uuid;primaryKey" json:"organizationId"`
	User           User      `gorm:"foreignKey:UserID" json:"-"`
	Organization   Organization `gorm:"foreignKey:OrganizationID" json:"-"`
}

// TableName specifies the table name for UserOrganization
func (UserOrganization) TableName() string {
	return "user_organizations"
}


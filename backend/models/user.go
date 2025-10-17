package models

type User struct {
	BaseModel
	Email         string         `gorm:"unique;not null" json:"email" public:"true"`
	PasswordHash  string         `gorm:"not null" json:"-" public:"false"`
	FirstName     string         `json:"firstName" public:"true"`
	LastName      string         `json:"lastName" public:"true"`
	IsActive      bool           `gorm:"default:true" json:"isActive" public:"true"`
	Role          string         `gorm:"type:varchar(16);default:'user'" json:"role" public:"true"`
	Organizations []Organization `gorm:"many2many:user_organizations;" json:"organizations,omitempty" public:"false"`
} 
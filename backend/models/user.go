package models

type User struct {
	BaseModel
	Email         string         `gorm:"unique;not null" json:"email"`
	PasswordHash  string         `gorm:"not null" json:"-"`
	FirstName     string         `json:"firstName"`
	LastName      string         `json:"lastName"`
	IsActive      bool           `gorm:"default:true" json:"isActive"`
	Role          string         `gorm:"type:varchar(16);default:'user'" json:"role"`
	Organizations []Organization `gorm:"many2many:user_organizations;" json:"organizations,omitempty"`
} 
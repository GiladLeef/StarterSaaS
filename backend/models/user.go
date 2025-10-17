package models

import "github.com/gin-gonic/gin"

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

// ToPublicJSON returns a public-safe representation of the user
func (u *User) ToPublicJSON() gin.H {
	return gin.H{
		"id":        u.ID,
		"email":     u.Email,
		"firstName": u.FirstName,
		"lastName":  u.LastName,
		"role":      u.Role,
		"isActive":  u.IsActive,
	}
} 
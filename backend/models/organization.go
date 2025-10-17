package models

type Organization struct {
	BaseModel
	Name        string    `gorm:"not null" json:"name"`
	Slug        string    `gorm:"unique;not null" json:"slug"`
	Description string    `json:"description"`
	Users       []User    `gorm:"many2many:user_organizations;" json:"users,omitempty"`
	Projects    []Project `gorm:"foreignKey:OrganizationID" json:"projects,omitempty"`
} 
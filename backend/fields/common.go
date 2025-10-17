package fields

import "encoding/json"

// Common field type definitions - simplified with shared unmarshal logic

type Email struct {
	Value string `json:"email" binding:"required,email"`
}
func (f *Email) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type Password struct {
	Value string `json:"password" binding:"required,min=8"`
}
func (f *Password) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type Name struct {
	Value string `json:"name" binding:"required"`
}
func (f *Name) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type FirstName struct {
	Value string `json:"firstName" binding:"required"`
}
func (f *FirstName) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type LastName struct {
	Value string `json:"lastName" binding:"required"`
}
func (f *LastName) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type Token struct {
	Value string `json:"token" binding:"required"`
}
func (f *Token) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type OrganizationID struct {
	Value string `json:"organizationId" binding:"required"`
}
func (f *OrganizationID) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type Description struct {
	Value string `json:"description"`
}
func (f *Description) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type Slug struct {
	Value string `json:"slug"`
}
func (f *Slug) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }

type Status struct {
	Value string `json:"status"`
}
func (f *Status) UnmarshalJSON(data []byte) error { return json.Unmarshal(data, &f.Value) }
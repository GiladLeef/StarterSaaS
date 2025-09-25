package fields

import (
	"encoding/json"
)

type Email struct {
	Value string `json:"email" binding:"required,email"`
}

func (e *Email) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &e.Value)
}

func (e Email) String() string {
	return e.Value
}

type Password struct {
	Value string `json:"password" binding:"required,min=8"`
}

func (p *Password) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &p.Value)
}

func (p Password) String() string {
	return p.Value
}

type Name struct {
	Value string `json:"name" binding:"required"`
}

func (n *Name) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &n.Value)
}

func (n Name) String() string {
	return n.Value
}

type FirstName struct {
	Value string `json:"firstName" binding:"required"`
}

func (f *FirstName) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &f.Value)
}

func (f FirstName) String() string {
	return f.Value
}

type LastName struct {
	Value string `json:"lastName" binding:"required"`
}

func (l *LastName) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &l.Value)
}

func (l LastName) String() string {
	return l.Value
}

type Token struct {
	Value string `json:"token" binding:"required"`
}

func (t *Token) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &t.Value)
}

func (t Token) String() string {
	return t.Value
}

type OrganizationID struct {
	Value string `json:"organizationId" binding:"required"`
}

func (o *OrganizationID) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &o.Value)
}

func (o OrganizationID) String() string {
	return o.Value
}

type Description struct {
	Value string `json:"description"`
}

func (d *Description) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &d.Value)
}

func (d Description) String() string {
	return d.Value
}

type Slug struct {
	Value string `json:"slug"`
}

func (s *Slug) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &s.Value)
}

func (s Slug) String() string {
	return s.Value
}

type Status struct {
	Value string `json:"status"`
}

func (s *Status) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &s.Value)
}

func (s Status) String() string {
	return s.Value
}
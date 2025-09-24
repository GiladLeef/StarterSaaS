package fields

type Email struct {
	Value string `json:"email" binding:"required,email"`
}

type OptionalEmail struct {
	Value string `json:"email" binding:"omitempty,email"`
}

type Password struct {
	Value string `json:"password" binding:"required,min=8"`
}

type Name struct {
	Value string `json:"name" binding:"required"`
}

type FirstName struct {
	Value string `json:"firstName" binding:"required"`
}

type LastName struct {
	Value string `json:"lastName" binding:"required"`
}

type Token struct {
	Value string `json:"token" binding:"required"`
}

type OrganizationID struct {
	Value string `json:"organizationId" binding:"required"`
}

type Description struct {
	Value string `json:"description"`
}

type Slug struct {
	Value string `json:"slug"`
}

type Status struct {
	Value string `json:"status"`
}

func (e Email) String() string {
	return e.Value
}

func (e OptionalEmail) String() string {
	return e.Value
}

func (p Password) String() string {
	return p.Value
}

func (n Name) String() string {
	return n.Value
}

func (f FirstName) String() string {
	return f.Value
}

func (l LastName) String() string {
	return l.Value
}

func (t Token) String() string {
	return t.Value
}

func (o OrganizationID) String() string {
	return o.Value
}

func (d Description) String() string {
	return d.Value
}

func (s Slug) String() string {
	return s.Value
}

func (s Status) String() string {
	return s.Value
}
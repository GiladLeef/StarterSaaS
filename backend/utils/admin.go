package utils

import (
	"reflect"
	"strings"

	"platform/backend/db"
)

type ResourceMetadata struct {
	Name          string
	PluralName    string
	ModelType     reflect.Type
	Fields        []FieldMetadata
	Capabilities  []string
	SearchFields  []string
	DisplayFields []string
}

type FieldMetadata struct {
	Name     string
	Type     string
	Label    string
	Required bool
	Editable bool
}

var adminResources = make(map[string]*ResourceMetadata)

func RegisterAdminResource(name string, model interface{}, capabilities []string) *ResourceMetadata {
	modelType := reflect.TypeOf(model)
	if modelType.Kind() == reflect.Ptr {
		modelType = modelType.Elem()
	}

	fields := extractFields(modelType)
	
	metadata := &ResourceMetadata{
		Name:          name,
		PluralName:    pluralize(name),
		ModelType:     modelType,
		Fields:        fields,
		Capabilities:  capabilities,
		SearchFields:  extractSearchFields(fields),
		DisplayFields: extractDisplayFields(fields),
	}

	adminResources[name] = metadata
	return metadata
}

func GetAdminResources() map[string]*ResourceMetadata {
	return adminResources
}

func GetAdminResource(name string) *ResourceMetadata {
	return adminResources[name]
}

func FetchAdminResourceData(resourceName string) any {
	metadata := GetAdminResource(resourceName)
	Check(metadata != nil)
	
	modelType := metadata.ModelType
	sliceType := reflect.SliceOf(modelType)
	slicePtr := reflect.New(sliceType)
	
	TryErr(db.DB.Find(slicePtr.Interface()).Error)
	
	return slicePtr.Elem().Interface()
}

func CountAdminResource(resourceName string, where ...interface{}) int64 {
	metadata := GetAdminResource(resourceName)
	Check(metadata != nil)
	
	var count int64
	query := db.DB.Model(reflect.New(metadata.ModelType).Interface())
	
	if len(where) > 0 {
		query = query.Where(where[0], where[1:]...)
	}
	
	TryErr(query.Count(&count).Error)
	return count
}

func extractFields(t reflect.Type) []FieldMetadata {
	var fields []FieldMetadata

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		
		if field.Anonymous {
			continue
		}

		jsonTag := field.Tag.Get("json")
		if jsonTag == "-" {
			continue
		}

		fieldName := strings.Split(jsonTag, ",")[0]
		if fieldName == "" {
			fieldName = field.Name
		}

		fieldMeta := FieldMetadata{
			Name:     fieldName,
			Type:     field.Type.String(),
			Label:    toLabel(field.Name),
			Required: !strings.Contains(field.Tag.Get("validate"), "omitempty"),
			Editable: !isSystemField(field.Name),
		}

		fields = append(fields, fieldMeta)
	}

	return fields
}

func extractSearchFields(fields []FieldMetadata) []string {
	var searchFields []string
	for _, f := range fields {
		if f.Type == "string" && !isSystemField(f.Name) {
			searchFields = append(searchFields, f.Name)
		}
	}
	return searchFields
}

func extractDisplayFields(fields []FieldMetadata) []string {
	var displayFields []string
	priority := []string{"name", "title", "email", "slug", "status"}
	
	for _, p := range priority {
		for _, f := range fields {
			if strings.ToLower(f.Name) == p {
				displayFields = append(displayFields, f.Name)
				break
			}
		}
	}
	
	for _, f := range fields {
		if len(displayFields) >= 5 {
			break
		}
		if !contains(displayFields, f.Name) && !isSystemField(f.Name) {
			displayFields = append(displayFields, f.Name)
		}
	}
	
	return displayFields
}

func isSystemField(name string) bool {
	systemFields := []string{"ID", "CreatedAt", "UpdatedAt", "DeletedAt", "PasswordHash"}
	for _, sf := range systemFields {
		if name == sf {
			return true
		}
	}
	return false
}

func toLabel(name string) string {
	result := ""
	for i, c := range name {
		if i > 0 && c >= 'A' && c <= 'Z' {
			result += " "
		}
		result += string(c)
	}
	return result
}

func pluralize(name string) string {
	if strings.HasSuffix(name, "y") {
		return name[:len(name)-1] + "ies"
	}
	if strings.HasSuffix(name, "s") {
		return name + "es"
	}
	return name + "s"
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

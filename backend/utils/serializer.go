package utils

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
)

// ToPublicJSON converts a struct to a public JSON representation using struct tags
// Fields with `public:"false"` or `public:"-"` are excluded
// Fields without the public tag are included by default
// Example:
//   type User struct {
//       ID           uuid.UUID `json:"id" public:"true"`
//       Email        string    `json:"email"`
//       PasswordHash string    `json:"-" public:"false"`
//   }
func ToPublicJSON(model interface{}) gin.H {
	result := gin.H{}
	
	val := reflect.ValueOf(model)
	typ := reflect.TypeOf(model)
	
	// Handle pointer types
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
		typ = typ.Elem()
	}
	
	// Iterate through all fields
	for i := 0; i < val.NumField(); i++ {
		field := typ.Field(i)
		value := val.Field(i)
		
		// Get the json tag
		jsonTag := field.Tag.Get("json")
		if jsonTag == "" {
			continue // Skip fields without json tag
		}
		
		// Parse json tag (could be "name,omitempty")
		jsonParts := strings.Split(jsonTag, ",")
		jsonName := jsonParts[0]
		
		// Skip if json tag is "-"
		if jsonName == "-" {
			continue
		}
		
		// Check public tag
		publicTag := field.Tag.Get("public")
		if publicTag == "false" || publicTag == "-" {
			continue
		}
		
		// Handle embedded structs (like BaseModel)
		if field.Anonymous {
			// Recursively handle embedded struct
			embedded := ToPublicJSON(value.Interface())
			for k, v := range embedded {
				result[k] = v
			}
			continue
		}
		
		// Add the field to result
		result[jsonName] = value.Interface()
	}
	
	return result
}

// ToPublicJSONArray converts a slice of models to public JSON representations
func ToPublicJSONArray(models interface{}) []gin.H {
	result := []gin.H{}
	
	val := reflect.ValueOf(models)
	if val.Kind() != reflect.Slice && val.Kind() != reflect.Array {
		return result
	}
	
	for i := 0; i < val.Len(); i++ {
		item := val.Index(i).Interface()
		result = append(result, ToPublicJSON(item))
	}
	
	return result
}


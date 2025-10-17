package utils

import (
	"reflect"

	"github.com/gin-gonic/gin"
)

func ExtractValues(source interface{}) map[string]interface{} {
	return ExtractFieldValues(source)
}

func ApplyValues(target, source interface{}) {
	AutoUpdate(target, source)
}

func BindResource[T any](c *gin.Context) *T {
	return Get(BindAndValidate[T](c))
}

func CreateFromFields[T any](req interface{}) *T {
	values := ExtractFieldValues(req)
	var result T
	
	targetVal := reflect.ValueOf(&result).Elem()
	targetType := targetVal.Type()
	
	for i := 0; i < targetVal.NumField(); i++ {
		field := targetVal.Field(i)
		fieldName := targetType.Field(i).Name
		
		if value, ok := values[fieldName]; ok {
			if field.CanSet() && field.Kind() == reflect.String {
				if str, ok := value.(string); ok && str != "" {
					field.SetString(str)
				}
			}
		}
	}
	
	return &result
}


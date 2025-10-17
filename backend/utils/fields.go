package utils

import "reflect"

func ExtractFieldValues(req interface{}) map[string]interface{} {
	result := make(map[string]interface{})
	v := reflect.ValueOf(req)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	
	t := v.Type()
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)
		
		// Check if field has a "Value" field (our custom field types)
		if field.Kind() == reflect.Struct {
			valueField := field.FieldByName("Value")
			if valueField.IsValid() {
				result[fieldType.Name] = valueField.Interface()
				continue
			}
		}
		
		// Otherwise use the field directly
		result[fieldType.Name] = field.Interface()
	}
	
	return result
}

func ApplyFieldValues(target interface{}, values map[string]interface{}) {
	v := reflect.ValueOf(target).Elem()
	t := v.Type()
	
	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)
		
		if value, ok := values[fieldType.Name]; ok {
			if !field.CanSet() {
				continue
			}
			
			valueStr, isString := value.(string)
			if isString && valueStr != "" {
				if field.Kind() == reflect.String {
					field.SetString(valueStr)
				}
			}
		}
	}
}

func AutoUpdate(target, source interface{}) {
	values := ExtractFieldValues(source)
	ApplyFieldValues(target, values)
}


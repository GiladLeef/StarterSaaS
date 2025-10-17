package utils

import (
	"reflect"
)

func ApplyFieldUpdates(target interface{}, source interface{}) {
	targetVal := reflect.ValueOf(target).Elem()
	sourceVal := reflect.ValueOf(source).Elem()
	sourceType := sourceVal.Type()

	for i := 0; i < sourceVal.NumField(); i++ {
		sourceField := sourceVal.Field(i)
		fieldName := sourceType.Field(i).Name
		
		targetField := targetVal.FieldByName(fieldName)
		if !targetField.IsValid() || !targetField.CanSet() {
			continue
		}

		if sourceField.Kind() == reflect.String {
			str := sourceField.String()
			if str != "" {
				targetField.SetString(str)
			}
		} else if sourceField.Type() == targetField.Type() {
			if !sourceField.IsZero() {
				targetField.Set(sourceField)
			}
		}
	}
}


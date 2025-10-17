package utils

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
)

func ToPublicJSON(model interface{}) gin.H {
	result := gin.H{}
	val := reflect.ValueOf(model)
	typ := reflect.TypeOf(model)
	
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
		typ = typ.Elem()
	}
	
	for i := 0; i < val.NumField(); i++ {
		field := typ.Field(i)
		value := val.Field(i)
		
		jsonTag := field.Tag.Get("json")
		if jsonTag == "" {
			continue
		}
		
		jsonName := strings.Split(jsonTag, ",")[0]
		if jsonName == "-" {
			continue
		}
		
		if publicTag := field.Tag.Get("public"); publicTag == "false" || publicTag == "-" {
			continue
		}
		
		if field.Anonymous {
			for k, v := range ToPublicJSON(value.Interface()) {
				result[k] = v
			}
			continue
		}
		
		result[jsonName] = value.Interface()
	}
	
	return result
}

func ToPublicJSONArray(models interface{}) []gin.H {
	result := []gin.H{}
	val := reflect.ValueOf(models)
	
	if val.Kind() != reflect.Slice && val.Kind() != reflect.Array {
		return result
	}
	
	for i := 0; i < val.Len(); i++ {
		result = append(result, ToPublicJSON(val.Index(i).Interface()))
	}
	
	return result
}


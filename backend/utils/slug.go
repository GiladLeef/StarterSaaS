package utils

import (
	"strings"
)

func GenerateUniqueSlug[T any](name, existingSlug, fieldName string) string {
	var slug string
	
	if existingSlug == "" {
		slug = strings.ToLower(strings.ReplaceAll(name, " ", "-"))
	} else {
		slug = strings.ToLower(existingSlug)
	}
	
	baseSlug := slug
	counter := 1
	
	for ExistsBy[T](fieldName, slug) {
		slug = baseSlug + "-" + IntToString(counter)
		counter++
	}
	
	return slug
}


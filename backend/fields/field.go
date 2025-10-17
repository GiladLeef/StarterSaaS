package fields

import (
	"encoding/json"
	"fmt"
)

// Field is a generic wrapper for form fields with validation
type Field[T any] struct {
	Value T
}

func (f *Field[T]) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, &f.Value)
}

func (f Field[T]) String() string {
	return fmt.Sprint(f.Value)
}

// Helper function to create a field
func NewField[T any](value T) Field[T] {
	return Field[T]{Value: value}
}


package utils

import (
	"github.com/gin-gonic/gin"
)

type abortError struct{}

func (abortError) Error() string { return "request aborted" }

func Abort() {
	panic(abortError{})
}

func Check(ok bool) {
	if !ok {
		Abort()
	}
}

func Get[T any](val T, ok bool) T {
	Check(ok)
	return val
}

func Try[T any](val T, err error) T {
	if err != nil {
		panic(err)
	}
	return val
}

func TryErr(err error) {
	if err != nil {
		panic(err)
	}
}

func Catch(c *gin.Context, fn func()) {
	defer func() {
		if r := recover(); r != nil {
			if _, ok := r.(abortError); !ok {
				if err, ok := r.(error); ok {
					RespondWithError(c, StatusError, err, "Internal error")
				} else {
					Respond(c, StatusError, "Internal error", nil)
				}
			}
		}
	}()
	fn()
}


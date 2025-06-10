package models

// swagger:model
type User struct {
	Email    string
	Password string
}

var Users = map[string]string{}

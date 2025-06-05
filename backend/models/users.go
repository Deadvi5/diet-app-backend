package models

// swagger:model
type User struct {
	Username string
	Password string
}

var Users = map[string]string{}

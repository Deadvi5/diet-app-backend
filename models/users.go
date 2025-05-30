package models

type User struct {
	Username string
	Password string
}

var Users = map[string]string{
	"dietista1": "password123",
	"dietista2": "password456",
}

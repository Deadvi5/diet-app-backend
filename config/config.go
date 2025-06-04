package config

import (
	"log"
	"os"
)

var JWTSecret = loadJWTSecret()

func loadJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("Warning: JWT_SECRET not set, using default secret")
		secret = "default-secret"
	}
	return []byte(secret)
}

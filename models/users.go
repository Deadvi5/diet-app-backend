package models

import (
    "encoding/hex"
    "golang.org/x/crypto/argon2"
)

// User represents login credentials sent by the client.
type User struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

const passwordSalt = "dietapp_salt"

func hashPassword(p string) string {
    hash := argon2.IDKey([]byte(p), []byte(passwordSalt), 1, 64*1024, 4, 32)
    return hex.EncodeToString(hash)
}

// Users stores demo users with hashed passwords.
var Users = map[string]string{
    "dietista1": hashPassword("password123"),
    "dietista2": hashPassword("password456"),
}

// VerifyUser returns true when the provided credentials are valid.
func VerifyUser(username, password string) bool {
    hash, exists := Users[username]
    if !exists {
        return false
    }
    return hash == hashPassword(password)
}

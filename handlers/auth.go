package handlers

import (
	"net/http"
	"time"

	"diet-app-backend/config"
	"diet-app-backend/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// swagger:route POST /login auth login
// Authenticate user and return JWT token.
//
// responses:
//
//	200: tokenResponse
func Login(c *gin.Context) {
	var credentials models.User
	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dati non validi"})
		return
	}

	expectedPassword, exists := models.Users[credentials.Username]
	if !exists || expectedPassword != credentials.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenziali non valide"})
		return
	}

	// Creazione del token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": credentials.Username,
		"exp":      time.Now().Add(time.Hour * 1).Unix(),
	})

	tokenString, err := token.SignedString(config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Errore nella generazione del token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

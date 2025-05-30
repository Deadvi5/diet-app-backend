package main

import (
	"diet-app-backend/handlers"
	"diet-app-backend/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Middleware globali (sempre eseguiti)
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.LoggingMiddleware())

	// Rotta pubblica per il login
	router.POST("/login", handlers.Login)

	// Rotte protette da JWT middleware
	auth := router.Group("/api/v1")
	auth.Use(middleware.JWTMiddleware())
	{
		auth.GET("/patients", handlers.GetPatients)
		auth.GET("/patient", handlers.GetPatientByID)
		auth.POST("/patients", handlers.CreatePatient)
	}

	router.Run(":8082")
}

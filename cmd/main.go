package main

import (
	"diet-app-backend/db"
	"diet-app-backend/handlers"
	"diet-app-backend/middleware"
	"github.com/gin-gonic/gin"
)

func main() {

	if err := db.Connect(); err != nil {
		panic("failed to connect database: " + err.Error())
	}
	
	router := gin.Default()

	// Middleware globali (sempre eseguiti)
       router.Use(middleware.CORSMiddleware())
       router.Use(middleware.LoggingMiddleware())

       // Basic health check
       router.GET("/healthz", handlers.HealthCheck)

	// Rotta pubblica per il login
	router.POST("/login", handlers.Login)

	// Rotte protette da JWT middleware
	auth := router.Group("/api/v1")
	auth.Use(middleware.JWTMiddleware())
	{
		auth.GET("/patients", handlers.GetPatients)
		auth.GET("/patients/:id", handlers.GetPatientByID)
		auth.POST("/patients", handlers.CreatePatient)
		auth.PUT("/patients/:id", handlers.UpdatePatient)
		auth.DELETE("/patients/:id", handlers.DeletePatient)
	}

	router.Run(":8080")
}

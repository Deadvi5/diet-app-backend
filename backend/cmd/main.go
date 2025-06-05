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

	// Rotta pubblica per il login
	router.POST("/login", handlers.Login)

	// Rotte protette da JWT middleware
	auth := router.Group("/api/v1")
	auth.Use(middleware.JWTMiddleware())
	{
		auth.GET("/dietists", handlers.GetDietists)
		auth.GET("/dietists/:dietistId", handlers.GetDietistByID)
		auth.POST("/dietists", handlers.CreateDietist)
		auth.PUT("/dietists/:dietistId", handlers.UpdateDietist)
		auth.DELETE("/dietists/:dietistId", handlers.DeleteDietist)

		auth.GET("/patients", handlers.GetPatients)
		auth.GET("/patients/:patientId", handlers.GetPatientByID)
		auth.POST("/patients", handlers.CreatePatient)
		auth.PUT("/patients/:patientId", handlers.UpdatePatient)
		auth.DELETE("/patients/:patientId", handlers.DeletePatient)

		auth.GET("/patients/:patientId/diets", handlers.GetDiets)
		auth.GET("/patients/:patientId/diets/:id", handlers.GetDietByID)
		auth.POST("/patients/:patientId/diets", handlers.CreateDiet)
		auth.PUT("/patients/:patientId/diets/:id", handlers.UpdateDiet)
		auth.DELETE("/patients/:patientId/diets/:id", handlers.DeleteDiet)
	}

	router.Run(":8080")
}

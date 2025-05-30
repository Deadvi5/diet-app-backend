package handlers

import (
	"diet-app-backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Handler per recuperare lista pazienti
func GetPatients(c *gin.Context) {
	patients := []models.Patient{
		{ID: "1", Name: "Mario Rossi"},
		{ID: "2", Name: "Anna Bianchi"},
	}

	c.JSON(http.StatusOK, patients)
}

// Handler per recuperare singolo paziente
func GetPatientByID(c *gin.Context) {
	id := c.Param("id")
	patient := models.Patient{ID: id, Name: "Mario Rossi"}

	c.JSON(http.StatusOK, patient)
}

// Handler per creare un paziente
func CreatePatient(c *gin.Context) {
	var patient models.Patient

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// qui salveresti il paziente nel DB
	c.JSON(http.StatusCreated, patient)
}

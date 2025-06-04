package handlers

import (
	"diet-app-backend/db"
	"diet-app-backend/models"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// Handler per recuperare lista pazienti
func GetPatients(c *gin.Context) {
	var patients []models.Patient
	// Preload diets so they are available on the patient model
	if err := db.DB.Preload("Diets").Find(&patients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch patients"})
		return
	}
	c.JSON(http.StatusOK, patients)
}

// Handler per recuperare singolo paziente
func GetPatientByID(c *gin.Context) {
	id := c.Param("id")
	var patient models.Patient
	// Preload diets so the returned patient includes them
	if err := db.DB.Preload("Diets").First(&patient, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}
	c.JSON(http.StatusOK, patient)
}

// Handler per creare un paziente
func CreatePatient(c *gin.Context) {
	var patient models.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := db.DB.Create(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create patient"})
		return
	}
	c.JSON(http.StatusCreated, patient)
}

// Update (replace) a patient
func UpdatePatient(c *gin.Context) {
	id := c.Param("id")
	var patient models.Patient
	if err := db.DB.First(&patient, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := db.DB.Save(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update patient"})
		return
	}
	c.JSON(http.StatusOK, patient)
}

// Delete a patient
func DeletePatient(c *gin.Context) {
	id := c.Param("id")

	var patient models.Patient
	// First, check if the patient exists
	if err := db.DB.First(&patient, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Delete the patient
	if err := db.DB.Delete(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete patient"})
		return
	}

	c.Status(http.StatusNoContent)
}

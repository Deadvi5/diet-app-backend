package handlers

import (
	"diet-app-backend/db"
	"diet-app-backend/models"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// swagger:route GET /api/v1/patients patients getPatients
// Returns all patients.
//
// responses:
//
//	200: patientsResponse
func GetPatients(c *gin.Context) {
	dietistID := c.GetUint("dietist_id")
	var patients []models.Patient
	if err := db.DB.Where("dietist_id = ?", dietistID).Find(&patients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch patients"})
		return
	}
	c.JSON(http.StatusOK, patients)
}

// swagger:route GET /api/v1/patients/{patientId} patients getPatientByID
// Returns a patient by ID.
//
// responses:
//
//	200: patientResponse
func GetPatientByID(c *gin.Context) {
	id := c.Param("patientId")
	dietistID := c.GetUint("dietist_id")
	var patient models.Patient
	if err := db.DB.Where("id = ? AND dietist_id = ?", id, dietistID).First(&patient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}
	c.JSON(http.StatusOK, patient)
}

// swagger:route POST /api/v1/patients patients createPatient
// Create a new patient.
//
// responses:
//
//	201: patientResponse
func CreatePatient(c *gin.Context) {
	dietistID := c.GetUint("dietist_id")
	var patient models.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	patient.DietistID = dietistID
	if err := db.DB.Create(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create patient"})
		return
	}
	c.JSON(http.StatusCreated, patient)
}

// swagger:route PUT /api/v1/patients/{patientId} patients updatePatient
// Update an existing patient.
//
// responses:
//
//	200: patientResponse
func UpdatePatient(c *gin.Context) {
	id := c.Param("patientId")
	dietistID := c.GetUint("dietist_id")
	var patient models.Patient
	if err := db.DB.Where("id = ? AND dietist_id = ?", id, dietistID).First(&patient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
		return
	}
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	patient.DietistID = dietistID
	if err := db.DB.Save(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update patient"})
		return
	}
	c.JSON(http.StatusOK, patient)
}

// swagger:route DELETE /api/v1/patients/{patientId} patients deletePatient
// Delete a patient.
//
// responses:
//
//	204:
func DeletePatient(c *gin.Context) {
	id := c.Param("patientId")
	dietistID := c.GetUint("dietist_id")

	var patient models.Patient
	if err := db.DB.Where("id = ? AND dietist_id = ?", id, dietistID).First(&patient).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Patient not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if err := db.DB.Delete(&patient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete patient"})
		return
	}

	c.Status(http.StatusNoContent)
}

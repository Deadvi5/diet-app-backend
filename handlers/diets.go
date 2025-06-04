package handlers

import (
	"fmt"
	"net/http"

	"diet-app-backend/db"
	"diet-app-backend/models"
	"github.com/gin-gonic/gin"
)

// swagger:route GET /api/v1/patients/{patientId}/diets diets getDiets
// Retrieve all diets for a patient.
//
// responses:
//
//	200: dietsResponse
func GetDiets(c *gin.Context) {
	patientID := c.Param("patientId")
	var diets []models.Diet
	if err := db.DB.Where("patient_id = ?", patientID).Find(&diets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch diets"})
		return
	}
	c.JSON(http.StatusOK, diets)
}

// swagger:route GET /api/v1/patients/{patientId}/diets/{id} diets getDietByID
// Retrieve a diet by ID.
//
// responses:
//
//	200: dietResponse
func GetDietByID(c *gin.Context) {
	id := c.Param("id")
	patientID := c.Param("patientId")
	var diet models.Diet
	if err := db.DB.Where("patient_id = ?", patientID).First(&diet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Diet not found"})
		return
	}
	c.JSON(http.StatusOK, diet)
}

// swagger:route POST /api/v1/patients/{patientId}/diets diets createDiet
// Create a new diet for a patient.
//
// responses:
//
//	201: dietResponse
func CreateDiet(c *gin.Context) {
	patientID := c.Param("patientId")
	var diet models.Diet
	if err := c.ShouldBindJSON(&diet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	diet.PatientID = parseUint(patientID)
	if err := db.DB.Create(&diet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create diet"})
		return
	}
	c.JSON(http.StatusCreated, diet)
}

// swagger:route PUT /api/v1/patients/{patientId}/diets/{id} diets updateDiet
// Update an existing diet.
//
// responses:
//
//	200: dietResponse
func UpdateDiet(c *gin.Context) {
	id := c.Param("id")
	patientID := c.Param("patientId")
	var diet models.Diet
	if err := db.DB.Where("patient_id = ?", patientID).First(&diet, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Diet not found"})
		return
	}
	if err := c.ShouldBindJSON(&diet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := db.DB.Save(&diet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update diet"})
		return
	}
	c.JSON(http.StatusOK, diet)
}

// swagger:route DELETE /api/v1/patients/{patientId}/diets/{id} diets deleteDiet
// Delete a diet.
//
// responses:
//
//	204:
func DeleteDiet(c *gin.Context) {
	id := c.Param("id")
	patientID := c.Param("patientId")
	if err := db.DB.Where("patient_id = ?", patientID).Delete(&models.Diet{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete diet"})
		return
	}
	c.Status(http.StatusNoContent)
}

// helper to convert string to uint
func parseUint(s string) uint {
	var id uint
	fmt.Sscanf(s, "%d", &id)
	return id
}

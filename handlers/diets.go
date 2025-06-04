package handlers

import (
	"fmt"
	"net/http"

	"diet-app-backend/db"
	"diet-app-backend/models"
	"github.com/gin-gonic/gin"
)

// GetDiets retrieves all diets for a patient
func GetDiets(c *gin.Context) {
	patientID := c.Param("patientId")
	var diets []models.Diet
	if err := db.DB.Where("patient_id = ?", patientID).Find(&diets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch diets"})
		return
	}
	c.JSON(http.StatusOK, diets)
}

// GetDietByID retrieves a specific diet for a patient
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

// CreateDiet creates a new diet for a patient
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

// UpdateDiet updates a diet for a patient
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

// DeleteDiet deletes a diet for a patient
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

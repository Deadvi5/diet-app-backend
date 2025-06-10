package handlers

import (
        "diet-app-backend/db"
        "diet-app-backend/models"
        "github.com/gin-gonic/gin"
        "golang.org/x/crypto/bcrypt"
        "net/http"
)

// swagger:route GET /api/v1/dietists dietists getDietists
// Returns all dietists.
//
// responses:
//
//	200: dietistsResponse
func GetDietists(c *gin.Context) {
	var dietists []models.Dietist
	if err := db.DB.Find(&dietists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dietists"})
		return
	}
	c.JSON(http.StatusOK, dietists)
}

// swagger:route GET /api/v1/dietists/{dietistId} dietists getDietistByID
// Returns a dietist by ID.
//
// responses:
//
//	200: dietistResponse
func GetDietistByID(c *gin.Context) {
	id := c.Param("dietistId")
	var dietist models.Dietist
	if err := db.DB.First(&dietist, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dietist not found"})
		return
	}
	c.JSON(http.StatusOK, dietist)
}

// swagger:route POST /api/v1/dietists dietists createDietist
// Create a new dietist.
//
// responses:
//
//	201: dietistResponse
func CreateDietist(c *gin.Context) {
        var dietist models.Dietist
        if err := c.ShouldBindJSON(&dietist); err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
                return
        }
       hashed, err := bcrypt.GenerateFromPassword([]byte(dietist.Password), bcrypt.DefaultCost)
       if err != nil {
               c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
               return
       }
       dietist.Password = string(hashed)
        if err := db.DB.Create(&dietist).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create dietist"})
                return
        }
        c.JSON(http.StatusCreated, dietist)
}

// swagger:route PUT /api/v1/dietists/{dietistId} dietists updateDietist
// Update an existing dietist.
//
// responses:
//
//	200: dietistResponse
func UpdateDietist(c *gin.Context) {
	id := c.Param("dietistId")
	var dietist models.Dietist
	if err := db.DB.First(&dietist, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dietist not found"})
		return
	}
       if err := c.ShouldBindJSON(&dietist); err != nil {
               c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
               return
       }
       if dietist.Password != "" {
               hashed, err := bcrypt.GenerateFromPassword([]byte(dietist.Password), bcrypt.DefaultCost)
               if err != nil {
                       c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
                       return
               }
               dietist.Password = string(hashed)
       }
       if err := db.DB.Save(&dietist).Error; err != nil {
               c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update dietist"})
               return
       }
	c.JSON(http.StatusOK, dietist)
}

// swagger:route DELETE /api/v1/dietists/{dietistId} dietists deleteDietist
// Delete a dietist.
//
// responses:
//
//	204:
func DeleteDietist(c *gin.Context) {
	id := c.Param("dietistId")
	if err := db.DB.Delete(&models.Dietist{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete dietist"})
		return
	}
	c.Status(http.StatusNoContent)
}

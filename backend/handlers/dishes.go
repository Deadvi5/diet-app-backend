package handlers

import (
	"net/http"

	"diet-app-backend/db"
	"diet-app-backend/models"
	"github.com/gin-gonic/gin"
)

// swagger:route GET /api/v1/diets/{dietId}/dishes dishes getDishes
// Returns all dishes for a diet.
//
// responses:
//
//	200: dishesResponse
func GetDishes(c *gin.Context) {
	dietID := c.Param("dietId")
	var dishes []models.Dish
	if err := db.DB.Where("diet_id = ?", dietID).Find(&dishes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dishes"})
		return
	}
	c.JSON(http.StatusOK, dishes)
}

// swagger:route POST /api/v1/diets/{dietId}/dishes dishes createDish
// Create a new dish for a diet.
//
// responses:
//
//	201: dishResponse
func CreateDish(c *gin.Context) {
	dietID := c.Param("dietId")
	var dish models.Dish
	if err := c.ShouldBindJSON(&dish); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	dish.DietID = parseUint(dietID)
	if err := db.DB.Create(&dish).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create dish"})
		return
	}
	c.JSON(http.StatusCreated, dish)
}

// swagger:route PUT /api/v1/diets/{dietId}/dishes/{id} dishes updateDish
// Update an existing dish.
//
// responses:
//
//	200: dishResponse
func UpdateDish(c *gin.Context) {
	id := c.Param("id")
	dietID := c.Param("dietId")
	var dish models.Dish
	if err := db.DB.Where("diet_id = ?", dietID).First(&dish, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dish not found"})
		return
	}
	if err := c.ShouldBindJSON(&dish); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := db.DB.Save(&dish).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update dish"})
		return
	}
	c.JSON(http.StatusOK, dish)
}

// swagger:route DELETE /api/v1/diets/{dietId}/dishes/{id} dishes deleteDish
// Delete a dish.
//
// responses:
//
//	204:
func DeleteDish(c *gin.Context) {
	id := c.Param("id")
	dietID := c.Param("dietId")
	if err := db.DB.Where("diet_id = ?", dietID).Delete(&models.Dish{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete dish"})
		return
	}
	c.Status(http.StatusNoContent)
}

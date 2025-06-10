package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"diet-app-backend/config"
	"diet-app-backend/db"
	"diet-app-backend/middleware"
	"diet-app-backend/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupDishTestDB(t *testing.T) {
	var err error
	db.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}
	if err := db.DB.AutoMigrate(&models.Dietist{}, &models.Patient{}, &models.Diet{}, &models.Dish{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
}

func createDishToken(id uint) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username":   "u",
		"dietist_id": id,
	})
	s, _ := token.SignedString(config.JWTSecret)
	return s
}

func setupDishesRouter() *gin.Engine {
	r := gin.New()
	auth := r.Group("/api/v1")
	auth.Use(middleware.JWTMiddleware())
	{
		auth.GET("/diets/:dietId/dishes", GetDishes)
		auth.POST("/diets/:dietId/dishes", CreateDish)
		auth.PUT("/diets/:dietId/dishes/:id", UpdateDish)
		auth.DELETE("/diets/:dietId/dishes/:id", DeleteDish)
	}
	return r
}

func TestDishCRUD(t *testing.T) {
	gin.SetMode(gin.TestMode)
	config.JWTSecret = []byte("test")
	setupDishTestDB(t)

	diet := models.Diet{Name: "Diet", PatientID: 1}
	db.DB.Create(&diet)

	router := setupDishesRouter()
	token := createDishToken(1)

	// create dish
	body := strings.NewReader(`{"name":"d1","calories":100,"protein":10,"carbs":20,"fat":5}`)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/diets/"+fmt.Sprint(diet.ID)+"/dishes", body)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("expected 201 got %d", w.Code)
	}
	var dish models.Dish
	json.Unmarshal(w.Body.Bytes(), &dish)

	// list dishes
	req, _ = http.NewRequest(http.MethodGet, "/api/v1/diets/"+fmt.Sprint(diet.ID)+"/dishes", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 got %d", w.Code)
	}
	var list []models.Dish
	json.Unmarshal(w.Body.Bytes(), &list)
	if len(list) != 1 || list[0].ID != dish.ID {
		t.Fatalf("unexpected list %#v", list)
	}

	// update dish
	upBody := strings.NewReader(`{"name":"updated","calories":150,"protein":15,"carbs":25,"fat":7}`)
	req, _ = http.NewRequest(http.MethodPut, "/api/v1/diets/"+fmt.Sprint(diet.ID)+"/dishes/"+fmt.Sprint(dish.ID), upBody)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 on update got %d", w.Code)
	}

	// delete dish
	req, _ = http.NewRequest(http.MethodDelete, "/api/v1/diets/"+fmt.Sprint(diet.ID)+"/dishes/"+fmt.Sprint(dish.ID), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusNoContent {
		t.Fatalf("expected 204 got %d", w.Code)
	}
}

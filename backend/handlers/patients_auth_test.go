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
       "golang.org/x/crypto/bcrypt"
       "github.com/gin-gonic/gin"
       "github.com/golang-jwt/jwt/v5"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) {
	var err error
	db.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}
	if err := db.DB.AutoMigrate(&models.Dietist{}, &models.Patient{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
}

func createToken(id uint) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username":   "u",
		"dietist_id": id,
	})
	s, _ := token.SignedString(config.JWTSecret)
	return s
}

func setupPatientsRouter() *gin.Engine {
	r := gin.New()
	auth := r.Group("/api/v1")
	auth.Use(middleware.JWTMiddleware())
	{
		auth.GET("/patients", GetPatients)
		auth.GET("/patients/:patientId", GetPatientByID)
		auth.PUT("/patients/:patientId", UpdatePatient)
	}
	return r
}

func TestDietistCannotAccessOthersPatients(t *testing.T) {
	gin.SetMode(gin.TestMode)
	config.JWTSecret = []byte("test")
	setupTestDB(t)

       h1, _ := bcrypt.GenerateFromPassword([]byte("pass1"), bcrypt.DefaultCost)
       h2, _ := bcrypt.GenerateFromPassword([]byte("pass2"), bcrypt.DefaultCost)
       d1 := models.Dietist{Username: "d1", Name: "A", Password: string(h1)}
       d2 := models.Dietist{Username: "d2", Name: "B", Password: string(h2)}
	db.DB.Create(&d1)
	db.DB.Create(&d2)
	p1 := models.Patient{Username: "p1", Name: "P1", DietistID: d1.ID}
	p2 := models.Patient{Username: "p2", Name: "P2", DietistID: d2.ID}
	db.DB.Create(&p1)
	db.DB.Create(&p2)

	router := setupPatientsRouter()

	// dietist2 should only see patient2
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/patients", nil)
	req.Header.Set("Authorization", "Bearer "+createToken(d2.ID))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 got %d", w.Code)
	}
	var pts []models.Patient
	json.Unmarshal(w.Body.Bytes(), &pts)
	t.Logf("patients list: %+v", pts)
	if len(pts) != 1 || pts[0].ID != p2.ID {
		t.Fatalf("unexpected patients list: %+v", pts)
	}

	// dietist2 cannot fetch patient1
	req, _ = http.NewRequest(http.MethodGet, "/api/v1/patients/"+fmt.Sprint(p1.ID), nil)
	req.Header.Set("Authorization", "Bearer "+createToken(d2.ID))
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404 got %d", w.Code)
	}

	// dietist2 cannot update patient1
	body := strings.NewReader(`{"username":"x","name":"x"}`)
	req, _ = http.NewRequest(http.MethodPut, "/api/v1/patients/"+fmt.Sprint(p1.ID), body)
	req.Header.Set("Authorization", "Bearer "+createToken(d2.ID))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404 on update got %d", w.Code)
	}
}

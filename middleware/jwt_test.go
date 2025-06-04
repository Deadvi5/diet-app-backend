package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// helper to create a token for tests
func createTestToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": "dietista1",
		"exp":      time.Now().Add(time.Hour).Unix(),
	})
	return token.SignedString(jwtSecret)
}

func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(JWTMiddleware())
	r.GET("/protected", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})
	return r
}

func TestJWTMiddlewareValidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := setupRouter()

	token, err := createTestToken()
	if err != nil {
		t.Fatalf("failed to create token: %v", err)
	}

	req, _ := http.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestJWTMiddlewareInvalidOrMissingToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := setupRouter()

	tests := []struct {
		name  string
		token string
	}{
		{"missing", ""},
		{"invalid", "Bearer invalid"},
	}

	for _, tt := range tests {
		req, _ := http.NewRequest(http.MethodGet, "/protected", nil)
		if tt.token != "" {
			req.Header.Set("Authorization", tt.token)
		}
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("%s: expected status 401, got %d", tt.name, w.Code)
		}
	}
}

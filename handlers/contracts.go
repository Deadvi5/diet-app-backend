package handlers

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// GetPactContract serves the Pact contract for the patient API.
func GetPactContract(c *gin.Context) {
	path := filepath.Join("contracts", "patient.json")
	data, err := os.ReadFile(path)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "contract not found"})
		return
	}
	c.Data(http.StatusOK, "application/json", data)
}

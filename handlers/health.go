package handlers

import "github.com/gin-gonic/gin"

// HealthCheck returns a simple status response.
func HealthCheck(c *gin.Context) {
    c.JSON(200, gin.H{"status": "ok"})
}


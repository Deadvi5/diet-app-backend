package models

import "time"

// swagger:model
type Diet struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PatientID   uint      `json:"patient_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

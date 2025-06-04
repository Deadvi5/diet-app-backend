package models

import "time"

// swagger:model
type Patient struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	// Diets holds all diets associated with the patient.
	// GORM will use PatientID as the foreign key by default, which matches
	// the Diet model's PatientID field.
	Diets []Diet `json:"diets" gorm:"foreignKey:PatientID"`
}

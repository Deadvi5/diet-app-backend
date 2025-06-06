package models

import "time"

// swagger:model
type Patient struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	DietistID uint      `json:"dietist_id"`
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Diets     []Diet    `json:"diets,omitempty" gorm:"-"`
}

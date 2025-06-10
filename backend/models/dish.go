package models

import "time"

// swagger:model
type Dish struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	DietID    uint      `json:"diet_id"`
	Name      string    `json:"name"`
	Calories  int       `json:"calories"`
	Protein   float32   `json:"protein"`
	Carbs     float32   `json:"carbs"`
	Fat       float32   `json:"fat"`
	CreatedAt time.Time `json:"created_at"`
}

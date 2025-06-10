package models

import "time"

// swagger:model
type Dietist struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FirstName string    `json:"first_name"`
	Surname   string    `json:"surname"`
	Email     string    `gorm:"unique" json:"email"`
	Password  string    `json:"password,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

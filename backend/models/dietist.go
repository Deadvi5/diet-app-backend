package models

import "time"

// swagger:model
type Dietist struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `json:"username"`
	Name      string    `json:"name"`
	Password  string    `json:"password,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

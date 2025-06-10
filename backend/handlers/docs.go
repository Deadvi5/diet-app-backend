package handlers

import "diet-app-backend/models"

// Common parameter and response definitions for go-swagger.

// swagger:parameters login
type LoginParams struct {
	// in:body
	Body models.User
}

// swagger:response tokenResponse
type tokenResponseWrapper struct {
	// in:body
	Body struct {
		Token string `json:"token"`
	}
}

// swagger:parameters getPatientByID updatePatient deletePatient
type patientParams struct {
	// in:path
	// required: true
	PatientID uint `json:"patientId"`
}

// swagger:parameters getDiets createDiet
type patientDietNoIDParams struct {
	// Patient ID
	// in:path
	// required: true
	PatientID uint `json:"patientId"`
}

// swagger:parameters getDietByID updateDiet deleteDiet
type patientDietParams struct {
	// Patient ID
	// in:path
	// required: true
	PatientID uint `json:"patientId"`
	// Diet ID (for diet operations)
	// in:path
	ID uint `json:"id"`
}

// swagger:response patientResponse
type patientResponseWrapper struct {
	// in:body
	Body models.Patient
}

// swagger:response patientsResponse
type patientsResponseWrapper struct {
	// in:body
	Body []models.Patient
}

// swagger:response dietResponse
type dietResponseWrapper struct {
	// in:body
	Body models.Diet
}

// swagger:response dietsResponse
type dietsResponseWrapper struct {
	// in:body
	Body []models.Diet
}

// swagger:response dishResponse
type dishResponseWrapper struct {
	// in:body
	Body models.Dish
}

// swagger:response dishesResponse
type dishesResponseWrapper struct {
	// in:body
	Body []models.Dish
}

// swagger:parameters getDishes createDish
type dietDishNoIDParams struct {
	// Diet ID
	// in:path
	// required: true
	DietID uint `json:"dietId"`
}

// swagger:parameters updateDish deleteDish
type dietDishParams struct {
	// Diet ID
	// in:path
	// required: true
	DietID uint `json:"dietId"`
	// Dish ID
	// in:path
	ID uint `json:"id"`
}

// swagger:parameters getDietistByID updateDietist deleteDietist
type dietistParams struct {
	// in:path
	// required: true
	DietistID uint `json:"dietistId"`
}

// swagger:response dietistResponse
type dietistResponseWrapper struct {
	// in:body
	Body models.Dietist
}

// swagger:response dietistsResponse
type dietistsResponseWrapper struct {
	// in:body
	Body []models.Dietist
}

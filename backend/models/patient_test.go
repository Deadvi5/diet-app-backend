package models

import "testing"

func TestPatientDietsField(t *testing.T) {
	p := Patient{ID: 1, Username: "user1", Name: "John"}
	p.Diets = append(p.Diets, Diet{Name: "test diet"})

	if len(p.Diets) != 1 {
		t.Fatalf("expected 1 diet, got %d", len(p.Diets))
	}
	if p.Diets[0].Name != "test diet" {
		t.Errorf("expected diet name 'test diet', got %q", p.Diets[0].Name)
	}
}

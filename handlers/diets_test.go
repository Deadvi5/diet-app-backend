package handlers

import "testing"

func TestParseUint(t *testing.T) {
	tests := []struct {
		input string
		want  uint
	}{
		{"123", 123},
		{"0", 0},
		{"invalid", 0},
	}

	for _, tt := range tests {
		got := parseUint(tt.input)
		if got != tt.want {
			t.Errorf("parseUint(%q) = %d, want %d", tt.input, got, tt.want)
		}
	}
}

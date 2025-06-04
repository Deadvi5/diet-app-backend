package contracts

import (
    "encoding/json"
    "fmt"
    "net/http"
    "testing"

    "diet-app-backend/models"
    "github.com/pact-foundation/pact-go/v2/consumer"
    "github.com/pact-foundation/pact-go/v2/matchers"
)

func TestPatientContract(t *testing.T) {
    mockProvider, err := consumer.NewV2Pact(consumer.MockHTTPProviderConfig{
        Consumer: "DietApp Frontend",
        Provider: "DietApp Backend",
        PactDir:  "./contracts",
    })
    if err != nil {
        t.Fatalf("failed to create pact: %v", err)
    }

    err = mockProvider.
        AddInteraction().
        Given("Patient 1 exists").
        UponReceiving("A request for patient 1").
        WithRequest(http.MethodGet, "/patients/1").
        WillRespondWith(http.StatusOK, func(b *consumer.V2ResponseBuilder) {
            b.BodyMatch(&models.Patient{})
        }).
        ExecuteTest(t, func(cfg consumer.MockServerConfig) error {
            resp, err := http.Get(fmt.Sprintf("http://%s:%d/patients/1", cfg.Host, cfg.Port))
            if err != nil {
                return err
            }
            defer resp.Body.Close()
            if resp.StatusCode != http.StatusOK {
                return fmt.Errorf("expected status 200, got %d", resp.StatusCode)
            }
            var p models.Patient
            if err := json.NewDecoder(resp.Body).Decode(&p); err != nil {
                return err
            }
            if p.ID == 0 {
                return fmt.Errorf("expected non-zero patient id")
            }
            return nil
        })
    if err != nil {
        t.Fatalf("pact verification failed: %v", err)
    }
}

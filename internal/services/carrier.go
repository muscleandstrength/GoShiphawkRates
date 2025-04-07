package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/muscleandstrength/GoShiphawkRates/internal/config"
	"github.com/muscleandstrength/GoShiphawkRates/internal/models"
)

type CarrierService struct {
	cfg      *config.Config
	carriers []models.Carrier
}

func NewCarrierService(cfg *config.Config) *CarrierService {
	return &CarrierService{
		cfg: cfg,
	}
}

func (s *CarrierService) Initialize() error {
	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/v4/carriers", s.cfg.ShipHawkBaseURL), nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("X-API-Key", s.cfg.ShipHawkAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to fetch carriers: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to fetch carriers: status code %d", resp.StatusCode)
	}

	var carriers []models.Carrier
	if err := json.NewDecoder(resp.Body).Decode(&carriers); err != nil {
		return fmt.Errorf("failed to decode carriers response: %v", err)
	}

	s.carriers = carriers
	return nil
}

func (s *CarrierService) GetCarriers() []models.Carrier {
	return s.carriers
}

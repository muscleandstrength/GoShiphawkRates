package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/muscleandstrength/GoShiphawkRates/internal/config"
	"github.com/muscleandstrength/GoShiphawkRates/internal/models"
)

// ShipHawkService handles interactions with the ShipHawk API
type ShipHawkService struct {
	config *config.Config
}

// NewShipHawkService creates a new ShipHawkService instance
func NewShipHawkService(cfg *config.Config) *ShipHawkService {
	return &ShipHawkService{
		config: cfg,
	}
}

// GetRateQuotes gets shipping rate quotes from ShipHawk
func (s *ShipHawkService) GetRateQuotes(req *models.ShipmentRequest) (*models.ShipHawkResponse, error) {
	// Create ShipHawk request
	shipHawkReq := models.ShipHawkRequest{
		Items:              req.Items,
		OriginAddress:      req.OriginAddress,
		DestinationAddress: req.DestinationAddress,
		WarehouseCode:      req.WarehouseCode,
		CarrierFilter:      req.CarrierFilter,
	}

	// If no warehouse ID is set, provide a default
	if len(shipHawkReq.WarehouseCode) == 0 {
		shipHawkReq.WarehouseCode = "01"
	}

	// If no carrier filter is set, provide a default
	if len(shipHawkReq.CarrierFilter) == 0 {
		shipHawkReq.CarrierFilter = []string{}
	}

	// If we don't have full addresses but have zip codes, create basic addresses
	if shipHawkReq.OriginAddress == nil && req.OriginZip != "" {
		shipHawkReq.OriginAddress = &models.Address{
			Zip:     req.OriginZip,
			Country: "US",
		}
	}

	if shipHawkReq.DestinationAddress == nil && req.DestinationZip != "" {
		country := "US" // Default to US
		if req.DestinationCountryID != "" {
			country = req.DestinationCountryID
		}
		shipHawkReq.DestinationAddress = &models.Address{
			Zip:     req.DestinationZip,
			Country: country,
		}
	}

	// Ensure destination address has correct country from request
	if shipHawkReq.DestinationAddress != nil && req.DestinationCountryID != "" {
		shipHawkReq.DestinationAddress.Country = req.DestinationCountryID
	}

	// Ensure all items have quantity set (convert from Qty if needed)
	for i := range shipHawkReq.Items {
		if shipHawkReq.Items[i].Quantity == 0 {
			shipHawkReq.Items[i].Quantity = shipHawkReq.Items[i].Qty
		}
		if shipHawkReq.Items[i].Quantity == 0 {
			shipHawkReq.Items[i].Quantity = 1
		}

		// Set default country of origin if not provided
		if shipHawkReq.Items[i].CountryOfOrigin == "" {
			shipHawkReq.Items[i].CountryOfOrigin = "US"
		}

		// If name is not provided, use a default
		if shipHawkReq.Items[i].Name == "" {
			shipHawkReq.Items[i].Name = fmt.Sprintf("Package %d", i+1)
		}
	}

	// Validate request
	if (shipHawkReq.DestinationAddress == nil || shipHawkReq.DestinationAddress.Zip == "") && req.DestinationZip == "" {
		return nil, fmt.Errorf("destination address or zip code is required")
	}

	if len(shipHawkReq.Items) == 0 {
		return nil, fmt.Errorf("at least one package item is required")
	}

	// Convert request to JSON
	requestBody, err := json.Marshal(shipHawkReq)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Create request to ShipHawk API
	ratesURL := fmt.Sprintf("%s/api/v4/rates", s.config.ShipHawkBaseURL)
	httpReq, err := http.NewRequest("POST", ratesURL, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-API-KEY", s.config.ShipHawkAPIKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Log the raw response body
	log.Printf("ShipHawk response body: %s", string(body))

	// Check response status
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("ShipHawk API returned status code %d", resp.StatusCode)
	}

	// Parse response
	var shipHawkResp models.ShipHawkResponse
	if err := json.Unmarshal(body, &shipHawkResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &shipHawkResp, nil
}

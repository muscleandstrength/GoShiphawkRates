package usps

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"golang.org/x/oauth2/clientcredentials"
)

// RateService represents the USPS API service
type RateService struct {
	client  *http.Client
	baseURL string
}

// NewRateService creates a new USPS service instance
func NewRateService() (*RateService, error) {
	config, _ := LoadUSPSConfig()

	auth := &clientcredentials.Config{
		ClientID:     config.USPSConsumerKey,
		ClientSecret: config.USPSConsumerSecret,
		TokenURL:     fmt.Sprintf("%s/oauth2/v3/token", config.USPSBaseURL),
		//Scopes:       []string{"shipping"},
	}

	ctx := context.Background()
	client := auth.Client(ctx)

	return &RateService{
		client:  client,
		baseURL: config.USPSBaseURL,
	}, nil
}

// RateRequest represents the request for a rate quote
type RateRequest struct {
	FromZipCode   string   `json:"originZIPCode"`
	ToZipCode     string   `json:"destinationZIPCode"`
	Weight        float64  `json:"weight"`
	Length        float64  `json:"length"`
	Width         float64  `json:"width"`
	Height        float64  `json:"height"`
	MailClasses   []string `json:"mailClasses,omitempty"`
	PriceType     string   `json:"priceType,omitempty"`
	MailingDate   string   `json:"mailingDate,omitempty"`
	AccountType   string   `json:"accountType,omitempty"`
	AccountNumber string   `json:"AccountNumber,omitempty"`
}

// RateResponse represents the response from the USPS rate API
type RateResponse struct {
	RateOptions []struct {
		TotalBasePrice float64 `json:"totalBasePrice"`
		Rates          []struct {
			Description                  string  `json:"description"`
			PriceType                    string  `json:"priceType"`
			Price                        float64 `json:"price"`
			Weight                       float64 `json:"weight"`
			DimWeight                    float64 `json:"dimWeight"`
			Fees                         []any   `json:"fees"` // Can be more specific if needed
			StartDate                    string  `json:"startDate"`
			EndDate                      string  `json:"endDate"`
			MailClass                    string  `json:"mailClass"`
			Zone                         string  `json:"zone"`
			ProductName                  string  `json:"productName"`
			ProductDefinition            string  `json:"productDefinition"`
			ProcessingCategory           string  `json:"processingCategory"`
			RateIndicator                string  `json:"rateIndicator"`
			DestinationEntryFacilityType string  `json:"destinationEntryFacilityType"`
			SKU                          string  `json:"SKU"`
		} `json:"rates"`
		ExtraServices []struct {
			ExtraService string  `json:"extraService"`
			Name         string  `json:"name"`
			PriceType    string  `json:"priceType"`
			Price        float64 `json:"price"`
			Warnings     []struct {
				WarningCode        string `json:"warningCode"`
				WarningDescription string `json:"warningDescription"`
			} `json:"warnings"`
			SKU string `json:"SKU"`
		} `json:"extraServices"`
	} `json:"rateOptions"`
}

// GetRates retrieves shipping rates from USPS
func (s *RateService) GetRates(ctx context.Context, req RateRequest) (*RateResponse, error) {
	url := fmt.Sprintf("%s/prices/v3/total-rates/search", s.baseURL)

	// Convert request to JSON
	jsonData, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")

	// Send request
	resp, err := s.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Log the raw response body
	//log.Printf("USPS response body: %s", string(body))

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Parse response
	var rateResponse RateResponse
	if err := json.Unmarshal(body, &rateResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &rateResponse, nil
}

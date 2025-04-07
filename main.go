package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

// Configuration holds API keys and other config values
type Configuration struct {
	ShipHawkAPIKey  string
	ShipHawkBaseURL string
}

// PackageItem represents a single item to be shipped
type PackageItem struct {
	Length          float64 `json:"length,omitempty"`
	Width           float64 `json:"width,omitempty"`
	Height          float64 `json:"height,omitempty"`
	Weight          float64 `json:"weight"`
	Qty             int     `json:"qty,omitempty"`
	Name            string  `json:"name,omitempty"`
	Description     string  `json:"description,omitempty"`
	SKU             string  `json:"sku,omitempty"`
	Value           float64 `json:"value,omitempty"`
	Quantity        int     `json:"quantity"`
	HSCode          string  `json:"hs_code,omitempty"`
	CountryOfOrigin string  `json:"country_of_origin,omitempty"`
}

// Address represents a shipping address
type Address struct {
	Name        string `json:"name"`
	Company     string `json:"company,omitempty"`
	Street1     string `json:"street1"`
	Street2     string `json:"street2,omitempty"`
	City        string `json:"city"`
	State       string `json:"state"`
	Zip         string `json:"zip"`
	Country     string `json:"country"`
	PhoneNumber string `json:"phone_number,omitempty"`
}

// ShipmentRequest represents the request for rate quotes
type ShipmentRequest struct {
	OriginZip          string        `json:"origin_zip,omitempty"`
	DestinationZip     string        `json:"destination_zip,omitempty"`
	Items              []PackageItem `json:"items"`
	OriginAddress      *Address      `json:"origin_address,omitempty"`
	DestinationAddress *Address      `json:"destination_address,omitempty"`
	WarehouseCode      string        `json:"warehouse_code,omitempty"`
	CarrierFilter      []string      `json:"carrier_filter,omitempty"`
}

// ShipHawkRequest represents the request format for ShipHawk API
type ShipHawkRequest struct {
	Items              []PackageItem `json:"items"`
	OriginAddress      *Address      `json:"origin_address,omitempty"`
	DestinationAddress *Address      `json:"destination_address,omitempty"`
	WarehouseCode      string        `json:"warehouse_code,omitempty"`
	CarrierFilter      []string      `json:"carrier_filter,omitempty"`
}

// Rate represents a single shipping rate option
type Rate struct {
	ID                  string  `json:"id"`
	Carrier             string  `json:"carrier"`
	CarrierCode         string  `json:"carrier_code"`
	ServiceName         string  `json:"service_name"`
	ServiceCode         string  `json:"service_code"`
	ServiceLevel        string  `json:"service_level"`
	StandardServiceName string  `json:"standardized_service_name"`
	RateDisplayName     string  `json:"rate_display_name"`
	Price               string  `json:"price"`
	CurrencyCode        string  `json:"currency_code"`
	EstDeliveryDate     string  `json:"est_delivery_date"`
	EstDeliveryTime     *string `json:"est_delivery_time"`
	ServiceDays         int     `json:"service_days"`
	RatesProvider       string  `json:"rates_provider"`
	InsurancePrice      float64 `json:"insurance_price"`
}

// ShipHawkResponse represents the response from ShipHawk API
type ShipHawkResponse struct {
	Rates []Rate `json:"rates"`
}

var config Configuration

func init() {
	// Load .env file if it exists
	godotenv.Load()

	// Set config from environment variables
	config = Configuration{
		ShipHawkAPIKey:  os.Getenv("SHIPHAWK_API_KEY"),
		ShipHawkBaseURL: os.Getenv("SHIPHAWK_BASE_URL"),
	}

	if config.ShipHawkAPIKey == "" {
		log.Fatal("SHIPHAWK_API_KEY environment variable is required")
	}

	// Set default base URL if not provided
	if config.ShipHawkBaseURL == "" {
		config.ShipHawkBaseURL = "https://api.shiphawk.com"
	}
}

func main() {
	// Create a new HTTP server mux
	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("POST /api/quote", getRateQuotes)

	// Serve static files for the frontend
	fileServer := http.FileServer(http.Dir("./public"))
	mux.Handle("/", fileServer)

	// Add middleware for CORS
	handler := enableCORS(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := ":" + port
	server := &http.Server{
		Addr:    addr,
		Handler: handler,
	}

	fmt.Printf("Server starting on port %s...\n", port)
	log.Fatal(server.ListenAndServe())
}

// enableCORS middleware to handle CORS headers
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

func getRateQuotes(w http.ResponseWriter, r *http.Request) {
	var shipmentReq ShipmentRequest

	// Parse request body
	if err := json.NewDecoder(r.Body).Decode(&shipmentReq); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Create ShipHawk request
	shipHawkReq := ShipHawkRequest{
		Items:              shipmentReq.Items,
		OriginAddress:      shipmentReq.OriginAddress,
		DestinationAddress: shipmentReq.DestinationAddress,
		WarehouseCode:      shipmentReq.WarehouseCode,
		CarrierFilter:      shipmentReq.CarrierFilter,
	}

	// If no carrier filter is set, provide a default
	if len(shipHawkReq.CarrierFilter) == 0 {
		shipHawkReq.CarrierFilter = []string{}
	}

	// If we don't have full addresses but have zip codes, create basic addresses
	if shipHawkReq.OriginAddress == nil && shipmentReq.OriginZip != "" {
		shipHawkReq.OriginAddress = &Address{
			Zip:     shipmentReq.OriginZip,
			Country: "US",
		}
	}

	if shipHawkReq.DestinationAddress == nil && shipmentReq.DestinationZip != "" {
		shipHawkReq.DestinationAddress = &Address{
			Zip:     shipmentReq.DestinationZip,
			Country: "US",
		}
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
	if (shipHawkReq.DestinationAddress == nil || shipHawkReq.DestinationAddress.Zip == "") && shipmentReq.DestinationZip == "" {
		http.Error(w, "Destination address or zip code is required", http.StatusBadRequest)
		return
	}

	if len(shipHawkReq.Items) == 0 {
		http.Error(w, "At least one package item is required", http.StatusBadRequest)
		return
	}

	// Convert request to JSON
	requestBody, err := json.Marshal(shipHawkReq)
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}

	// Log the request for debugging
	log.Printf("ShipHawk request: %s", string(requestBody))

	// Create request to ShipHawk API using the configured base URL
	ratesURL := fmt.Sprintf("%s/api/v4/rates", config.ShipHawkBaseURL)
	req, err := http.NewRequest("POST", ratesURL, bytes.NewBuffer(requestBody))
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Api-Key", config.ShipHawkAPIKey)

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to get rates from ShipHawk", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response", http.StatusInternalServerError)
		return
	}

	// Log the response for debugging
	log.Printf("ShipHawk response status: %d", resp.StatusCode)
	log.Printf("ShipHawk response body: %s", string(respBody))

	// Check if ShipHawk returned an error (non-2xx status)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("ShipHawk API error: %s", string(respBody))
		http.Error(w, "ShipHawk API error", http.StatusInternalServerError)
		return
	}

	// Parse ShipHawk response
	var shipHawkResp map[string]interface{}
	if err := json.Unmarshal(respBody, &shipHawkResp); err != nil {
		http.Error(w, "Failed to parse response", http.StatusInternalServerError)
		return
	}

	// Return the response as-is
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(shipHawkResp)
}

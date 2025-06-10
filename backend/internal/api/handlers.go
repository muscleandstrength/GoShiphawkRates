package api

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/muscleandstrength/GoShiphawkRates/internal/models"
	"github.com/muscleandstrength/GoShiphawkRates/internal/services"
)

// Handler struct holds the service dependencies
type Handler struct {
	shipHawkService *services.ShipHawkService
	uspsService     *services.USPSService
	carrierService  *services.CarrierService
}

// NewHandler creates a new Handler instance
func NewHandler(shipHawkService *services.ShipHawkService, uspsService *services.USPSService, carrierService *services.CarrierService) *Handler {
	return &Handler{
		shipHawkService: shipHawkService,
		uspsService:     uspsService,
		carrierService:  carrierService,
	}
}

// GetCarriers handles the carriers request
func (h *Handler) GetCarriers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	carriers := h.carrierService.GetCarriers()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(carriers)
}

// GetRateQuotes handles the rate quotes request
func (h *Handler) GetRateQuotes(w http.ResponseWriter, r *http.Request) {
	// Read body as plaintext
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(r.Body)

	// Convert body to string
	bodyText := string(body)

	// Log the raw body for debugging
	log.Printf("Raw request body: %s\n", bodyText)

	// Parse request body
	var shipmentReq models.ShipmentRequest
	if err := json.Unmarshal(body, &shipmentReq); err != nil {
		log.Print(err.Error())
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Create a combined response
	combinedResponse := models.ShipHawkResponse{
		Rates: []models.Rate{},
	}

	// Get rate quotes from ShipHawk
	shipHawkResp, err := h.shipHawkService.GetRateQuotes(&shipmentReq)
	if err != nil {
		log.Printf("Error getting ShipHawk rates: %v", err)
	} else {
		combinedResponse.Rates = append(combinedResponse.Rates, shipHawkResp.Rates...)
	}

	// Get rate quotes from USPS
	uspsRates, err := h.uspsService.GetRateQuotes(&shipmentReq)
	if err != nil {
		log.Printf("Error getting USPS rates: %v", err)
	} else {
		combinedResponse.Rates = append(combinedResponse.Rates, uspsRates...)
	}

	// Return response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(combinedResponse)
}

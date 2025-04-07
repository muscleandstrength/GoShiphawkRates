package api

import (
	"encoding/json"
	"net/http"

	"github.com/muscleandstrength/GoShiphawkRates/internal/models"
	"github.com/muscleandstrength/GoShiphawkRates/internal/services"
)

// Handler struct holds the service dependencies
type Handler struct {
	shipHawkService *services.ShipHawkService
}

// NewHandler creates a new Handler instance
func NewHandler(shipHawkService *services.ShipHawkService) *Handler {
	return &Handler{
		shipHawkService: shipHawkService,
	}
}

// GetRateQuotes handles the rate quotes request
func (h *Handler) GetRateQuotes(w http.ResponseWriter, r *http.Request) {
	var shipmentReq models.ShipmentRequest

	// Parse request body
	if err := json.NewDecoder(r.Body).Decode(&shipmentReq); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Get rate quotes from ShipHawk
	resp, err := h.shipHawkService.GetRateQuotes(&shipmentReq)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

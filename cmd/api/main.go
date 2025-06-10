package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/muscleandstrength/GoShiphawkRates/internal/api"
	"github.com/muscleandstrength/GoShiphawkRates/internal/config"
	"github.com/muscleandstrength/GoShiphawkRates/internal/middleware"
	"github.com/muscleandstrength/GoShiphawkRates/internal/services"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Create services
	shipHawkService := services.NewShipHawkService(cfg)
	carrierService := services.NewCarrierService(cfg)

	// Create USPS service
	uspsService, err := services.NewUSPSService()
	if err != nil {
		log.Fatalf("Failed to create USPS service: %v", err)
	}

	// Initialize carrier service
	if err := carrierService.Initialize(); err != nil {
		log.Fatalf("Failed to initialize carrier service: %v", err)
	}

	// Create handlers
	handler := api.NewHandler(shipHawkService, uspsService, carrierService)

	// Create a new HTTP server mux
	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("GET /api/carriers", handler.GetCarriers)
	mux.HandleFunc("POST /api/quote", handler.GetRateQuotes)

	// Serve static files for the frontend (React build output)
	fileServer := http.FileServer(http.Dir("./dist"))
	mux.Handle("/", fileServer)

	// Add middleware for CORS
	handlerWithMiddleware := middleware.CORS(mux)

	// Create server
	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: handlerWithMiddleware,
	}

	fmt.Printf("Server starting on port %s...\n", cfg.Port)
	log.Fatal(server.ListenAndServe())
}

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

	// Create handlers
	handler := api.NewHandler(shipHawkService)

	// Create a new HTTP server mux
	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("POST /api/quote", handler.GetRateQuotes)

	// Serve static files for the frontend
	fileServer := http.FileServer(http.Dir("./public"))
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

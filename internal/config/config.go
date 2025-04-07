package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration values
type Config struct {
	ShipHawkAPIKey  string
	ShipHawkBaseURL string
	Port            string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	config := &Config{
		ShipHawkAPIKey:  os.Getenv("SHIPHAWK_API_KEY"),
		ShipHawkBaseURL: os.Getenv("SHIPHAWK_BASE_URL"),
		Port:            os.Getenv("PORT"),
	}

	if config.ShipHawkAPIKey == "" {
		return nil, ErrMissingAPIKey
	}

	// Set default values
	if config.ShipHawkBaseURL == "" {
		config.ShipHawkBaseURL = "https://api.shiphawk.com"
	}

	if config.Port == "" {
		config.Port = "8080"
	}

	return config, nil
}

// Errors
var (
	ErrMissingAPIKey = &ConfigError{"SHIPHAWK_API_KEY environment variable is required"}
)

type ConfigError struct {
	message string
}

func (e *ConfigError) Error() string {
	return e.message
}

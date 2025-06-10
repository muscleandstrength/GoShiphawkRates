package usps

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration values
type Config struct {
	USPSConsumerKey    string
	USPSConsumerSecret string
	USPSBaseURL        string
}

func LoadUSPSConfig() (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	config := &Config{
		USPSConsumerKey:    os.Getenv("USPS_CONSUMER_KEY"),
		USPSConsumerSecret: os.Getenv("USPS_CONSUMER_SECRET"),
		USPSBaseURL:        os.Getenv("USPS_BASE_URL"),
	}

	if config.USPSConsumerKey == "" {
		return nil, ErrMissingConsumerKey
	}

	if config.USPSConsumerSecret == "" {
		return nil, ErrMissingConsumerSecret
	}

	// Set default values
	if config.USPSBaseURL == "" {
		config.USPSBaseURL = "https://apis.usps.com"
	}

	return config, nil
}

// Errors
var (
	ErrMissingConsumerKey    = &ConfigError{"USPS_CONSUMER_KEY environment variable is required"}
	ErrMissingConsumerSecret = &ConfigError{"USPS_CONSUMER_SECRET environment variable is required"}
)

type ConfigError struct {
	message string
}

func (e *ConfigError) Error() string {
	return e.message
}

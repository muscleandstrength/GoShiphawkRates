# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Go-based shipping rate comparison service that integrates with multiple carriers (ShipHawk and USPS) to provide rate quotes. The project is organized into separate backend and frontend directories:

- **Backend** (`backend/`): Go application with API server and CLI tool
  - **API Server** (`backend/cmd/api/main.go`): HTTP server that serves both API endpoints and React frontend
  - **CLI Tool** (`backend/cmd/cli/main.go`): Command-line USPS rate quoting tool
- **Frontend** (`frontend/`): React 19 + TypeScript + Tailwind CSS web interface for rate comparison

## Build Commands

### Development
All commands should be run from the `backend/` directory:
- `cd backend && make run` - Run the API server in development mode
- `cd backend && make dev-frontend` - Run the React frontend dev server (port 3000)
- `cd backend && make test` - Run all tests
- `cd backend && make lint` - Run linter (requires golangci-lint)

### Building
All commands should be run from the `backend/` directory:
- `cd backend && make build` - Build the Go backend to `backend/bin/GoShiphawkRates`
- `cd backend && make build-frontend` - Build the React frontend to `frontend/dist/`
- `cd backend && make build-usps-client` - Build the CLI tool to `backend/bin/usps`
- `cd backend && make all` - Clean and build both frontend and backend
- `cd backend && make clean` - Remove build artifacts

### CLI Usage
```bash
./backend/bin/usps -from 29209 -to 90210 -weight 2.5 -length 12 -width 8 -height 6 -verbose
```

## Architecture

### Service Layer Architecture
The application uses a service-oriented architecture with clear separation of concerns:

- **Config Service** (`backend/internal/config/`): Environment-based configuration with `.env` file support
- **Handler Layer** (`backend/internal/api/handlers.go`): HTTP request handling with combined rate aggregation
- **Service Layer** (`backend/internal/services/`):
  - `ShipHawkService`: Integrates with ShipHawk API for carrier rates
  - `USPSService`: Integrates with USPS API using OAuth2 client credentials
  - `CarrierService`: Manages available carriers and filtering

### Rate Aggregation Flow
1. Single API endpoint (`POST /api/quote`) accepts unified shipment requests
2. Parallel rate requests to both ShipHawk and USPS services
3. Rate normalization and combination into unified response format
4. Error handling allows partial success (one service can fail without breaking the other)

### Data Models
- **Unified Request Format**: `models.ShipmentRequest` handles both ZIP-only and full address requests
- **Rate Standardization**: Both services convert to common `models.Rate` format
- **Flexible Package Items**: Support for dimensions, weight, HSCode, and multiple quantities

### USPS Integration
- Uses OAuth2 client credentials flow for authentication
- Filters rates by processing category (machinable only) and rate indicators
- Maps USPS service names to standardized service levels (Ground, Three-Day, Two-Day)

### Configuration Requirements
Required environment variables:
- `SHIPHAWK_API_KEY`: ShipHawk API key
- `USPS_CONSUMER_KEY`: USPS API consumer key  
- `USPS_CONSUMER_SECRET`: USPS API consumer secret

Optional:
- `SHIPHAWK_BASE_URL`: Defaults to https://api.shiphawk.com
- `USPS_BASE_URL`: USPS API base URL
- `PORT`: Server port (defaults to 8080)

## Testing

Run tests with: `cd backend && make test`

The test suite should validate:
- Rate request/response transformations
- Service integrations (use mocks for external APIs)
- Configuration loading and validation
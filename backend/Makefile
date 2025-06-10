# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
BIN_DIR=bin
BINARY_NAME=GoShiphawkRates
USPS_CLIENT_BINARY=usps
MAIN_PATH=cmd/api/main.go
USPS_CLIENT_PATH=cmd/cli/main.go
# Build flags
LDFLAGS=-ldflags "-s -w"

.PHONY: all build clean test run build-usps-client build-frontend

all: clean build-frontend build build-usps-client

build:
	$(GOBUILD) $(LDFLAGS) -o $(BIN_DIR)/$(BINARY_NAME) $(MAIN_PATH)

build-usps-client:
	$(GOBUILD) $(LDFLAGS) -o $(BIN_DIR)/$(USPS_CLIENT_BINARY) $(USPS_CLIENT_PATH)

build-frontend:
	cd ../frontend && npm install
	cd ../frontend && npm run build

clean:
	$(GOCLEAN)
	rm -f $(BIN_DIR)/$(BINARY_NAME)
	rm -f $(BIN_DIR)/$(USPS_CLIENT_BINARY)
	rm -rf ../frontend/dist
	rm -rf ../frontend/node_modules

test:
	$(GOTEST) -v ./...

run:
	$(GOCMD) run $(MAIN_PATH)

dev-frontend:
	cd ../frontend && npm run dev

# Cross-compilation targets
build-linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GOBUILD) $(LDFLAGS) -o $(BINARY_NAME)-linux $(MAIN_PATH)

build-mac-intel:
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 $(GOBUILD) $(LDFLAGS) -o $(BINARY_NAME)-mac $(MAIN_PATH)

build-mac-arm:
	CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 $(GOBUILD) $(LDFLAGS) -o $(BINARY_NAME)-mac $(MAIN_PATH)

build-windows:
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 $(GOBUILD) $(LDFLAGS) -o $(BINARY_NAME)-windows.exe $(MAIN_PATH)

# Docker targets
docker-build:
	docker build -t $(BINARY_NAME) .

docker-run:
	docker run -p 8080:8080 $(BINARY_NAME)

# Development tools
install-tools:
	$(GOGET) -u golang.org/x/lint/golint
	$(GOGET) -u github.com/golangci/golangci-lint/cmd/golangci-lint

lint:
	golangci-lint run

# Help target
help:
	@echo "Available targets:"
	@echo "  all         - Clean and build the project (including frontend)"
	@echo "  build       - Build the Go backend"
	@echo "  build-frontend - Build the React frontend"
	@echo "  build-usps-client - Build the USPS client CLI tool"
	@echo "  clean       - Remove build artifacts"
	@echo "  test        - Run tests"
	@echo "  run         - Run the Go backend"
	@echo "  dev-frontend - Run the frontend dev server"
	@echo "  build-linux - Build for Linux"
	@echo "  build-mac   - Build for macOS"
	@echo "  build-win   - Build for Windows"
	@echo "  docker-build- Build Docker image"
	@echo "  docker-run  - Run Docker container"
	@echo "  install-tools - Install development tools"
	@echo "  lint        - Run linter" 

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
BIN_DIR=bin
BINARY_NAME=GoShiphawkRates
MAIN_PATH=cmd/api/main.go
# Build flags
LDFLAGS=-ldflags "-s -w"

.PHONY: all build clean test run

all: clean build

build:
	$(GOBUILD) $(LDFLAGS) -o $(BIN_DIR)/$(BINARY_NAME) $(MAIN_PATH)

clean:
	$(GOCLEAN)
	rm -f $(BIN_DIR)/$(BINARY_NAME)

test:
	$(GOTEST) -v ./...

run:
	$(GOCMD) run $(MAIN_PATH)

# Cross-compilation targets
build-linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GOBUILD) $(LDFLAGS) -o $(BINARY_NAME)-linux $(MAIN_PATH)

build-mac:
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 $(GOBUILD) $(LDFLAGS) -o $(BINARY_NAME)-mac $(MAIN_PATH)

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
	@echo "  all         - Clean and build the project"
	@echo "  build       - Build the project"
	@echo "  clean       - Remove build artifacts"
	@echo "  test        - Run tests"
	@echo "  run         - Run the application"
	@echo "  build-linux - Build for Linux"
	@echo "  build-mac   - Build for macOS"
	@echo "  build-win   - Build for Windows"
	@echo "  docker-build- Build Docker image"
	@echo "  docker-run  - Run Docker container"
	@echo "  install-tools - Install development tools"
	@echo "  lint        - Run linter" 

package services

import (
	"context"
	"fmt"
	"time"

	"github.com/muscleandstrength/GoShiphawkRates/internal/models"
	"github.com/muscleandstrength/GoShiphawkRates/internal/usps"
)

// USPSService handles interactions with the USPS API
type USPSService struct {
	uspsClient *usps.RateService
}

// NewUSPSService creates a new USPSService instance
func NewUSPSService() (*USPSService, error) {
	client, err := usps.NewRateService()
	if err != nil {
		return nil, fmt.Errorf("failed to create USPS service: %w", err)
	}

	return &USPSService{
		uspsClient: client,
	}, nil
}

// GetRateQuotes gets shipping rate quotes from USPS
func (s *USPSService) GetRateQuotes(req *models.ShipmentRequest) ([]models.Rate, error) {
	// Convert ShipmentRequest to USPS RateRequest
	uspsReq := usps.RateRequest{
		FromZipCode: req.OriginZip,
		ToZipCode:   req.DestinationZip,
		MailClasses: []usps.MailClass{
			usps.PriorityMail,
			usps.GroundAdvantage,
			usps.PriorityMailExpress,
		},
		PriceType:   usps.Commercial,
		AccountType: usps.EPS,
	}

	// Use the first package item for dimensions and weight
	if len(req.Items) > 0 {
		item := req.Items[0]
		uspsReq.Weight = item.Weight
		uspsReq.Length = item.Length
		uspsReq.Width = item.Width
		uspsReq.Height = item.Height
	}

	// Get rates from USPS
	uspsRates, err := s.uspsClient.GetRates(context.Background(), uspsReq)
	if err != nil {
		return nil, fmt.Errorf("failed to get USPS rates: %w", err)
	}

	// Convert USPS rates to our Rate model
	var rates []models.Rate
	// Filter for only machinable rates
	for _, rateOption := range uspsRates.RateOptions {
		for _, rate := range rateOption.Rates {
			// Skip non-machinable rates
			if rate.ProcessingCategory != usps.Machinable ||
				(rate.RateIndicator != usps.SinglePiece && rate.RateIndicator != usps.PriorityExpressSinglePiece) ||
				rate.DestinationEntryFacilityType != usps.None {
				continue
			}
			rate := models.Rate{
				Carrier:             "USPS",
				CarrierCode:         "USPS",
				ServiceName:         rate.ProductName,
				ServiceCode:         rate.Description,
				StandardServiceName: standardizeServiceName(rate.ProductName),
				RateDisplayName:     rate.ProductName,
				Price:               fmt.Sprintf("%.2f", rate.Price),
				CurrencyCode:        "USD",
				ServiceDays:         serviceDays(rate),
				EstDeliveryDate:     time.Now().AddDate(0, 0, serviceDays(rate)).Format("2006-01-02"),
				RatesProvider:       "USPS",
			}
			rates = append(rates, rate)
		}
	}

	return rates, nil
}

func serviceDays(rate usps.Rate) int {
	// Implement your logic to determine service days based on the rate
	// For example, you can map USPS service names to service days
	switch rate.ProductName {
	case "Priority Mail":
		return 3
	case "Priority Mail Express":
		return 2
	default:
		return 4
	}
}

func standardizeServiceName(serviceName string) string {
	// Implement your standardization logic here
	// For example, you can map USPS service names to your standardized names
	switch serviceName {
	case "USPS Ground Advantage":
		return "Ground"
	case "Priority Mail":
		return "Three-Day"
	case "Priority Mail Express":
		return "Two-Day"
	default:
		return serviceName
	}
}

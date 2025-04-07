package models

// PackageItem represents a single item to be shipped
type PackageItem struct {
	Length          float64 `json:"length,omitempty"`
	Width           float64 `json:"width,omitempty"`
	Height          float64 `json:"height,omitempty"`
	Weight          float64 `json:"weight"`
	WeightUOM       string  `json:"weight_uom,omitempty"`
	Qty             int     `json:"qty,omitempty"`
	Name            string  `json:"name,omitempty"`
	Description     string  `json:"description,omitempty"`
	SKU             string  `json:"sku,omitempty"`
	Value           float64 `json:"value,omitempty"`
	Quantity        int     `json:"quantity"`
	HSCode          string  `json:"hs_code,omitempty"`
	CountryOfOrigin string  `json:"country_of_origin,omitempty"`
}

// Address represents a shipping address
type Address struct {
	Name        string `json:"name"`
	Company     string `json:"company,omitempty"`
	Street1     string `json:"street1"`
	Street2     string `json:"street2,omitempty"`
	City        string `json:"city"`
	State       string `json:"state"`
	Zip         string `json:"zip"`
	Country     string `json:"country"`
	PhoneNumber string `json:"phone_number,omitempty"`
}

// ShipmentRequest represents the request for rate quotes
type ShipmentRequest struct {
	OriginZip          string        `json:"origin_zip,omitempty"`
	DestinationZip     string        `json:"destination_zip,omitempty"`
	Items              []PackageItem `json:"items"`
	OriginAddress      *Address      `json:"origin_address,omitempty"`
	DestinationAddress *Address      `json:"destination_address,omitempty"`
	WarehouseCode      string        `json:"warehouse_code,omitempty"`
	CarrierFilter      []string      `json:"carrier_filter,omitempty"`
}

// ShipHawkRequest represents the request format for ShipHawk API
type ShipHawkRequest struct {
	Items              []PackageItem `json:"items"`
	OriginAddress      *Address      `json:"origin_address,omitempty"`
	DestinationAddress *Address      `json:"destination_address,omitempty"`
	WarehouseCode      string        `json:"warehouse_code,omitempty"`
	CarrierFilter      []string      `json:"carrier_filter,omitempty"`
}

// Rate represents a single shipping rate option
type Rate struct {
	ID                  string  `json:"id"`
	Carrier             string  `json:"carrier"`
	CarrierCode         string  `json:"carrier_code"`
	ServiceName         string  `json:"service_name"`
	ServiceCode         string  `json:"service_code"`
	ServiceLevel        string  `json:"service_level"`
	StandardServiceName string  `json:"standardized_service_name"`
	RateDisplayName     string  `json:"rate_display_name"`
	Price               string  `json:"price"`
	CurrencyCode        string  `json:"currency_code"`
	EstDeliveryDate     string  `json:"est_delivery_date"`
	EstDeliveryTime     *string `json:"est_delivery_time"`
	ServiceDays         int     `json:"service_days"`
	RatesProvider       string  `json:"rates_provider"`
	InsurancePrice      float64 `json:"insurance_price"`
}

// ShipHawkResponse represents the response from ShipHawk API
type ShipHawkResponse struct {
	Rates []Rate `json:"rates"`
}

type Carrier struct {
	Code        string `json:"code"`
	CarrierType struct {
		Code string `json:"code"`
	} `json:"carrier_type"`
	Name                string   `json:"name"`
	IsEnabled           bool     `json:"is_enabled"`
	Activatable         bool     `json:"activatable"`
	RequiredCredentials []string `json:"required_credentials"`
	OptionalCredentials []string `json:"optional_credentials"`
	TestMode            bool     `json:"test_mode"`
	Status              string   `json:"status"`
	Logo                string   `json:"logo"`
}

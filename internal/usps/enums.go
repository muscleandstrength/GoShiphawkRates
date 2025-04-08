package usps

// MailClass represents the USPS mail class types
type MailClass string

const (
	PriorityMail        MailClass = "PRIORITY_MAIL"
	GroundAdvantage     MailClass = "USPS_GROUND_ADVANTAGE"
	FirstClassPackage   MailClass = "FIRST_CLASS_PACKAGE"
	PriorityMailExpress MailClass = "PRIORITY_MAIL_EXPRESS"
)

// PriceType represents the USPS price types
type PriceType string

const (
	Commercial PriceType = "COMMERCIAL"
	Retail     PriceType = "RETAIL"
)

// AccountType represents the USPS account types
type AccountType string

const (
	EPS AccountType = "EPS"
	CPP AccountType = "CPP"
)

// ProcessingCategory represents the USPS processing categories
type ProcessingCategory string

const (
	Machinable    ProcessingCategory = "MACHINABLE"
	NonMachinable ProcessingCategory = "NON_MACHINABLE"
)

// RateIndicator represents the USPS rate indicators
type RateIndicator string

const (
	SinglePiece                RateIndicator = "SP"
	PriorityExpressSinglePiece RateIndicator = "PA"
	CubicParcel                RateIndicator = "CP"
)

// DestinationEntryFacilityType represents the USPS destination entry facility types
type DestinationEntryFacilityType string

const (
	None      DestinationEntryFacilityType = "NONE"
	NDC       DestinationEntryFacilityType = "NDC"
	DSCF      DestinationEntryFacilityType = "DSCF"
	DDU       DestinationEntryFacilityType = "DDU"
	MixedNDC  DestinationEntryFacilityType = "MIXED_NDC"
	MixedDSCF DestinationEntryFacilityType = "MIXED_DSCF"
	MixedDDU  DestinationEntryFacilityType = "MIXED_DDU"
)

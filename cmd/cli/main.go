package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/fatih/color"

	"github.com/muscleandstrength/GoShiphawkRates/internal/usps"
)

func main() {
	// Define command line flags
	fromZip := flag.String("from", "29209", "Origin ZIP code")
	toZip := flag.String("to", "", "Destination ZIP code (required)")
	weight := flag.Float64("weight", 1.0, "Package weight in pounds")
	length := flag.Float64("length", 10.0, "Package length in inches")
	width := flag.Float64("width", 5.0, "Package width in inches")
	height := flag.Float64("height", 3.0, "Package height in inches")
	verbose := flag.Bool("verbose", false, "Verbose output")
	flag.Parse()

	// Validate required flags
	if *toZip == "" {
		fmt.Fprintln(os.Stderr, "Error: destination ZIP code is required")
		flag.Usage()
		os.Exit(1)
	}

	// Create USPS service
	service, err := usps.NewRateService()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating USPS service: %v\n", err)
		os.Exit(1)
	}

	// Create rate request
	req := usps.RateRequest{
		FromZipCode: *fromZip,
		ToZipCode:   *toZip,
		Weight:      *weight,
		Length:      *length,
		Width:       *width,
		Height:      *height,
		MailClasses: []string{"PRIORITY_MAIL", "USPS_GROUND_ADVANTAGE"},
		PriceType:   "COMMERCIAL",
		MailingDate: time.Now().AddDate(0, 0, 3).Format("2006-01-02"),
		AccountType: "EPS",
	}
	log.Printf("Mailing date: %s", req.MailingDate)
	// Get rates
	rates, err := service.GetRates(context.Background(), req)
	if err != nil {
		_, _ = fmt.Fprintf(os.Stderr, "Error getting rates: %v\n", err)
		os.Exit(1)
	}

	if *verbose {
		prettyPrintResponse(rates)
	}

	// Print a summary
	yellow := color.New(color.FgYellow).SprintFunc()
	fmt.Println("\n" + yellow("Summary:"))
	for _, rateOption := range rates.RateOptions {
		for _, rate := range rateOption.Rates {
			if rate.ProductName != "" {
				fmt.Printf("%s: $%.2f (%s)\n",
					rate.Description, rateOption.TotalBasePrice, rate.ProductDefinition)
			}
		}
	}
}

func prettyPrintResponse(rates *usps.RateResponse) {
	// Pretty print the response with colors
	prettyJSON, err := json.MarshalIndent(rates, "", "  ")
	if err != nil {
		_, _ = fmt.Fprintf(os.Stderr, "Error formatting JSON: %v\n", err)
		os.Exit(1)
	}

	//Create color functions
	blue := color.New(color.FgBlue).SprintFunc()
	green := color.New(color.FgGreen).SprintFunc()
	//yellow := color.New(color.FgYellow).SprintFunc()

	// Print the formatted JSON with colors
	fmt.Println(blue("USPS Rate Quote Results:"))
	fmt.Println(green(string(prettyJSON)))
}

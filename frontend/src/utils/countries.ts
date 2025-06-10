export interface Country {
  code: string;
  name: string;
  postalCodePattern?: RegExp;
  postalCodeLabel?: string;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', postalCodePattern: /^\d{5}(-\d{4})?$/, postalCodeLabel: 'ZIP Code' },
  { code: 'CA', name: 'Canada', postalCodePattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/, postalCodeLabel: 'Postal Code' },
  { code: 'GB', name: 'United Kingdom', postalCodePattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/, postalCodeLabel: 'Postcode' },
  { code: 'AU', name: 'Australia', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Postcode' },
  { code: 'DE', name: 'Germany', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Postleitzahl' },
  { code: 'FR', name: 'France', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Code Postal' },
  { code: 'IT', name: 'Italy', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'CAP' },
  { code: 'ES', name: 'Spain', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Código Postal' },
  { code: 'NL', name: 'Netherlands', postalCodePattern: /^\d{4} ?[A-Z]{2}$/, postalCodeLabel: 'Postcode' },
  { code: 'BE', name: 'Belgium', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Code Postal' },
  { code: 'CH', name: 'Switzerland', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'PLZ' },
  { code: 'AT', name: 'Austria', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'PLZ' },
  { code: 'SE', name: 'Sweden', postalCodePattern: /^\d{3} ?\d{2}$/, postalCodeLabel: 'Postnummer' },
  { code: 'NO', name: 'Norway', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Postnummer' },
  { code: 'DK', name: 'Denmark', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Postnummer' },
  { code: 'FI', name: 'Finland', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Postinumero' },
  // Additional EU countries
  { code: 'PL', name: 'Poland', postalCodePattern: /^\d{2}-\d{3}$/, postalCodeLabel: 'Kod pocztowy' },
  { code: 'CZ', name: 'Czech Republic', postalCodePattern: /^\d{3} ?\d{2}$/, postalCodeLabel: 'PSČ' },
  { code: 'HU', name: 'Hungary', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Irányítószám' },
  { code: 'SK', name: 'Slovakia', postalCodePattern: /^\d{3} ?\d{2}$/, postalCodeLabel: 'PSČ' },
  { code: 'SI', name: 'Slovenia', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Poštna številka' },
  { code: 'HR', name: 'Croatia', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Poštanski broj' },
  { code: 'BG', name: 'Bulgaria', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Пощенски код' },
  { code: 'RO', name: 'Romania', postalCodePattern: /^\d{6}$/, postalCodeLabel: 'Cod poștal' },
  { code: 'GR', name: 'Greece', postalCodePattern: /^\d{3} ?\d{2}$/, postalCodeLabel: 'Ταχυδρομικός κώδικας' },
  { code: 'CY', name: 'Cyprus', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Ταχυδρομικός κώδικας' },
  { code: 'MT', name: 'Malta', postalCodePattern: /^[A-Z]{3} ?\d{2,4}$/, postalCodeLabel: 'Postal Code' },
  { code: 'LV', name: 'Latvia', postalCodePattern: /^LV-\d{4}$/, postalCodeLabel: 'Pasta indekss' },
  { code: 'LT', name: 'Lithuania', postalCodePattern: /^LT-\d{5}$/, postalCodeLabel: 'Pašto kodas' },
  { code: 'EE', name: 'Estonia', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Postiindeks' },
  { code: 'LU', name: 'Luxembourg', postalCodePattern: /^L-\d{4}$/, postalCodeLabel: 'Code postal' },
  { code: 'IE', name: 'Ireland', postalCodePattern: /^[A-Z]{1}\d{2} ?[A-Z0-9]{4}$/, postalCodeLabel: 'Eircode' },
  { code: 'PT', name: 'Portugal', postalCodePattern: /^\d{4}-\d{3}$/, postalCodeLabel: 'Código postal' },
  { code: 'JP', name: 'Japan', postalCodePattern: /^\d{3}-?\d{4}$/, postalCodeLabel: '郵便番号' },
  { code: 'KR', name: 'South Korea', postalCodePattern: /^\d{5}$/, postalCodeLabel: '우편번호' },
  { code: 'IN', name: 'India', postalCodePattern: /^\d{6}$/, postalCodeLabel: 'PIN Code' },
  { code: 'BR', name: 'Brazil', postalCodePattern: /^\d{5}-?\d{3}$/, postalCodeLabel: 'CEP' },
  { code: 'MX', name: 'Mexico', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Código Postal' },
  { code: 'ZA', name: 'South Africa', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Postal Code' },
  { code: 'NZ', name: 'New Zealand', postalCodePattern: /^\d{4}$/, postalCodeLabel: 'Postcode' },
  { code: 'MY', name: 'Malaysia', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Postcode' },
  { code: 'SG', name: 'Singapore', postalCodePattern: /^\d{6}$/, postalCodeLabel: 'Postal Code' },
  { code: 'IL', name: 'Israel', postalCodePattern: /^\d{7}$/, postalCodeLabel: 'מיקוד' },
  { code: 'QA', name: 'Qatar', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'Postal Code' },
  { code: 'SA', name: 'Saudi Arabia', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'الرمز البريدي' },
  { code: 'IQ', name: 'Iraq', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'الرمز البريدي' },
  { code: 'KW', name: 'Kuwait', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'الرمز البريدي' },
  { code: 'AE', name: 'United Arab Emirates', postalCodePattern: /^\d{5}$/, postalCodeLabel: 'الرمز البريدي' },
];

/**
 * Detects the country based on postal code pattern
 */
export function detectCountryFromPostalCode(postalCode: string): Country | null {
  if (!postalCode) return null;
  
  const cleanCode = postalCode.trim().toUpperCase();
  
  for (const country of COUNTRIES) {
    if (country.postalCodePattern && country.postalCodePattern.test(cleanCode)) {
      return country;
    }
  }
  
  return null;
}

/**
 * Gets country by code
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code);
}

/**
 * Validates postal code for a specific country
 */
export function validatePostalCodeForCountry(postalCode: string, countryCode: string): boolean {
  const country = getCountryByCode(countryCode);
  if (!country || !country.postalCodePattern) return true; // Allow if no pattern defined
  
  return country.postalCodePattern.test(postalCode.trim().toUpperCase());
}
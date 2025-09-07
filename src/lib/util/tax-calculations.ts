import { convertToLocale } from "./money"

// Common VAT rates by region/country
const VAT_RATES: Record<string, number> = {
  // European Union countries (most common rates)
  de: 0.19, // Germany
  at: 0.20, // Austria  
  be: 0.21, // Belgium
  dk: 0.25, // Denmark
  es: 0.21, // Spain
  fi: 0.24, // Finland
  fr: 0.20, // France
  gr: 0.24, // Greece
  ie: 0.23, // Ireland
  it: 0.22, // Italy
  lu: 0.17, // Luxembourg
  nl: 0.21, // Netherlands
  pt: 0.23, // Portugal
  se: 0.25, // Sweden
  
  // Other regions
  gb: 0.20, // UK
  us: 0.08, // US (average, varies by state)
  ca: 0.13, // Canada (average, varies by province)
  au: 0.10, // Australia
  jp: 0.10, // Japan
  
  // Default fallback
  default: 0.19
}

/**
 * Get VAT rate for a country code
 * @param countryCode - ISO 2-letter country code
 * @returns VAT rate as decimal (e.g., 0.19 for 19%)
 */
export function getVatRate(countryCode?: string): number {
  if (!countryCode) return VAT_RATES.default
  
  const rate = VAT_RATES[countryCode.toLowerCase()]
  return rate || VAT_RATES.default
}

/**
 * Calculate net price from gross price when tax information is available
 * Uses the same logic as cart totals: netTotal = total - tax_total
 * This works universally for all tax rates since Medusa calculates the actual tax amounts
 * 
 * @param grossAmount - The gross amount including tax
 * @param taxAmount - The tax amount (if available from Medusa)
 * @param currencyCode - The currency code
 * @returns Object with formatted gross, net, and tax amounts
 */
export function getPriceBreakdown(
  grossAmount: number,
  taxAmount: number | null | undefined,
  currencyCode: string
) {
  const actualTaxAmount = taxAmount ?? 0
  const netAmount = grossAmount - actualTaxAmount

  return {
    gross: {
      amount: grossAmount,
      formatted: convertToLocale({
        amount: grossAmount,
        currency_code: currencyCode,
      }),
    },
    net: {
      amount: netAmount,
      formatted: convertToLocale({
        amount: netAmount,
        currency_code: currencyCode,
      }),
    },
    tax: {
      amount: actualTaxAmount,
      formatted: convertToLocale({
        amount: actualTaxAmount,
        currency_code: currencyCode,
      }),
    },
  }
}

/**
 * Calculate price breakdown from tax-inclusive gross price
 * Uses appropriate VAT rate based on currency/region
 * 
 * @param grossAmount - The gross amount including tax
 * @param countryCode - The country code to determine VAT rate
 * @param currencyCode - The currency code
 * @returns Object with formatted gross, net, and estimated tax amounts
 */
export function calculatePriceBreakdown(
  grossAmount: number,
  countryCode: string | undefined,
  currencyCode: string
) {
  const vatRate = getVatRate(countryCode)
  const netAmount = grossAmount / (1 + vatRate)
  const taxAmount = grossAmount - netAmount

  return {
    gross: {
      amount: grossAmount,
      formatted: convertToLocale({
        amount: grossAmount,
        currency_code: currencyCode,
      }),
    },
    net: {
      amount: netAmount,
      formatted: convertToLocale({
        amount: netAmount,
        currency_code: currencyCode,
      }),
    },
    tax: {
      amount: taxAmount,
      formatted: convertToLocale({
        amount: taxAmount,
        currency_code: currencyCode,
      }),
    },
    vatRate,
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use calculatePriceBreakdown instead
 */
export function estimatePriceBreakdown(
  grossAmount: number,
  vatRate: number = 0.19,
  currencyCode: string
) {
  const netAmount = grossAmount / (1 + vatRate)
  const taxAmount = grossAmount - netAmount

  return {
    gross: {
      amount: grossAmount,
      formatted: convertToLocale({
        amount: grossAmount,
        currency_code: currencyCode,
      }),
    },
    net: {
      amount: netAmount,
      formatted: convertToLocale({
        amount: netAmount,
        currency_code: currencyCode,
      }),
    },
    tax: {
      amount: taxAmount,
      formatted: convertToLocale({
        amount: taxAmount,
        currency_code: currencyCode,
      }),
    },
  }
}

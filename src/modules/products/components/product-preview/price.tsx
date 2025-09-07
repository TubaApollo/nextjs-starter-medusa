"use client"

import { VariantPrice } from "types/global"
import { calculatePriceBreakdown } from "@lib/util/tax-calculations"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"

interface PreviewPriceProps {
  price: VariantPrice
  region?: HttpTypes.StoreRegion
}

export default function PreviewPrice({ price, region }: PreviewPriceProps) {
  if (!price) {
    return null
  }

  const params = useParams()
  // Use the country code from the URL route (e.g., /de) instead of just taking the first region country
  const countryCode = (params.countryCode as string) || region?.countries?.[0]?.iso_2 || 'de'

  // Calculate price breakdown with tax information
  const priceBreakdown = calculatePriceBreakdown(
    price.calculated_price_number, 
    countryCode, 
    price.currency_code
  )

  const originalPriceBreakdown = price.price_type === "sale" && price.original_price_number
    ? calculatePriceBreakdown(
        price.original_price_number, 
        countryCode, 
        price.currency_code
      )
    : null

  return (
    <div className="flex flex-col">
      {/* Main price display */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-lg font-bold text-gray-900">
          {priceBreakdown.gross.formatted}
        </span>
        {price.price_type === "sale" && originalPriceBreakdown && (
          <span className="line-through text-gray-500 text-sm">
            ({originalPriceBreakdown.gross.formatted})
          </span>
        )}
      </div>
      
      {/* Tax information */}
      <div className="text-xs text-gray-500">
        <div>inkl. MwSt.</div>
        <div>
          Netto: {priceBreakdown.net.formatted}
        </div>
      </div>
    </div>
  )
}

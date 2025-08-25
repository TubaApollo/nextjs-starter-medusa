"use client"

import React from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { ProductHit } from "../../../../types/search"

// Format price from cents to euros
const formatPrice = (priceAmount: number): string => {
  // Check if the price is already in euros or in cents
  let euros = priceAmount
  
  // If the amount is very large (likely in cents), convert to euros
  if (priceAmount > 1000) {
    euros = priceAmount / 100
  }
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(euros)
}

// Get product title with fallbacks
const getProductTitle = (hit: ProductHit): string => {
  return hit.title || "Unbenanntes Produkt"
}

// Get SKU from variants
const getProductSKU = (hit: ProductHit): string => {
  if (hit.variants && hit.variants.length > 0) {
    const firstVariant = hit.variants[0]
    if (firstVariant.sku) {
      return firstVariant.sku
    }
  }
  if (hit.variant_sku && hit.variant_sku.length > 0) {
    return hit.variant_sku[0]
  }
  return ""
}

// Get stock status
const getStockStatus = (hit: ProductHit) => {
  const variants = hit.variants || []
  if (variants.length === 0) return { inStock: true, text: "Verfügbar" }
  
  const hasStock = variants.some(variant => 
    variant.inventory_quantity > 0 || variant.inventory_quantity === null || variant.allow_backorder
  )
  
  return {
    inStock: hasStock,
    text: hasStock ? "Auf Lager" : "Nicht verfügbar"
  }
}

interface CompactProductHitProps {
  hit: ProductHit
}

export default function CompactProductHit({ hit }: CompactProductHitProps) {
  console.log("CompactProductHit price debug:", hit.min_price)
  
  const title = getProductTitle(hit)
  const sku = getProductSKU(hit)
  const stockStatus = getStockStatus(hit)
  const price = hit.min_price ? formatPrice(hit.min_price) : "Preis auf Anfrage"

  return (
    <LocalizedClientLink href={`/products/${hit.handle}`}>
      <motion.div
        whileHover={{ backgroundColor: "#f9fafb" }}
        className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 hover:bg-gray-50 transition-colors relative"
      >
        {/* Stock Indicator - Positioned differently for column vs row layout */}
        <div className="absolute top-2 right-2 sm:top-2 sm:right-2">
          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
            stockStatus.inStock 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {stockStatus.inStock ? "Verfügbar" : "Nicht verfügbar"}
          </span>
        </div>

        {/* Image and Content Container for Mobile Stack */}
        <div className="flex items-start gap-3 sm:flex-1 sm:gap-3">
          {/* Product Image */}
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100">
            {hit.thumbnail ? (
              <Image
                src={hit.thumbnail}
                alt={title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="3" ry="3" strokeWidth="1.5" />
                  <circle cx="9" cy="9" r="1.5" strokeWidth="1.5" />
                  <path d="M21 15l-6-5-5 4-2-2-4 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 pr-20 sm:pr-24">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-tight">
              {title}
            </h4>
            
            {/* SKU Row */}
            {sku && (
              <div className="mb-2">
                <span className="text-[10px] sm:text-xs text-gray-600 font-mono bg-gray-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                  SKU: {sku}
                </span>
              </div>
            )}
            
            <p className="text-sm font-bold text-gray-900">
              {price}
            </p>
          </div>
        </div>
      </motion.div>
    </LocalizedClientLink>
  )
}

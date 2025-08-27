"use client"

import React from "react"
import { motion } from "framer-motion"
import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import WishlistButton from "@modules/common/components/wishlist-button"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { Inter } from "next/font/google"
import PreviewPrice from "@modules/products/components/product-preview/price"
import { VariantPrice } from "types/global"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export interface ProductHit {
  id: string
  objectID: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  min_price: number | null
  max_price: number | null
  variant_sku: string[]
  categories: string[]
  collection_title: string | null
  type: string | null
  tags: string[]
  status: string
  created_at: string
  updated_at: string
  variants: any[]
  __position: number
  __queryID: string
}

// Helper to build a VariantPrice-like object from a numeric amount (EUR)
const toVariantPrice = (amount: number | null | undefined): VariantPrice | null => {
  if (amount == null) return null
  const euros = amount > 1000 ? amount / 100 : amount
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(euros)
  return {
    calculated_price_number: euros,
    calculated_price: formatted,
    original_price_number: euros,
    original_price: formatted,
    currency_code: "eur",
    price_type: "default",
    percentage_diff: "0",
  }
}

// Get product title with fallbacks
const getProductTitle = (hit: ProductHit): string => {
  return hit.title || "Unbenanntes Produkt"
}

interface ProductHitProps {
  hit: ProductHit
}

const ProductHitComponent = ({ hit }: ProductHitProps) => {
  // Debug logs removed for cleanliness

  // Convert search hit to product-like structure
  const product = {
    id: hit.id,
    title: getProductTitle(hit),
    handle: hit.handle,
    thumbnail: hit.thumbnail,
    images: hit.thumbnail ? [{ url: hit.thumbnail }] : [],
    variants: hit.variants || []
  } as HttpTypes.StoreProduct

  // Format price for display using shared PreviewPrice component
  const cheapestPrice = toVariantPrice(hit.min_price)

  // Determine stock status 
  const hasInventory = (() => {
    const variants = hit.variants || []
    if (variants.length === 0) return true
    if (variants.some((v: any) => v?.allow_backorder)) return true
    if (variants.some((v: any) => v?.manage_inventory === false)) return true
    if (!variants.some((v: any) => typeof v?.inventory_quantity === "number")) return true
    return variants.some((v: any) => (v?.inventory_quantity as number) > 0)
  })()

  // Select a variant for direct add when available; otherwise use product fallback
  const variantsArr = Array.isArray(hit.variants) ? (hit.variants as any[]) : []
  const inStock = variantsArr.find((v) =>
    typeof v?.inventory_quantity === "number" ? (v.inventory_quantity as number) > 0 : true
  )
  const selectedVariant = variantsArr.length > 0 ? ((inStock || variantsArr[0]) as any) : undefined
  const isDisabled = variantsArr.length > 0
    ? (!selectedVariant || (typeof selectedVariant?.inventory_quantity === "number" && selectedVariant.inventory_quantity < 1))
    : false // when variants unknown, allow product fallback

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group h-full flex flex-col rounded-lg border border-ui-border-base bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${inter.className}`}
      data-testid="product-wrapper"
    >
      {/* Clickable area: image + main info */}
      <LocalizedClientLink href={`/products/${hit.handle}`} className="block flex-1">
        <Thumbnail
          thumbnail={hit.thumbnail}
          images={hit.thumbnail ? [{ url: hit.thumbnail }] : []}
          size="full"
          isFeatured
          className="p-2 sm:p-3 bg-transparent shadow-none rounded-none aspect-[1/1] sm:aspect-[11/14]"
        />
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
          <div className="mb-0.5">
            <Text
              className="text-ui-fg-base font-semibold leading-snug line-clamp-2 text-[13px] sm:text-sm"
              data-testid="product-title"
            >
              {product.title}
            </Text>
          </div>

          {/* SKU display, consistent with other cards */}
          {(() => {
            const sku = Array.isArray(hit.variants) && hit.variants.length > 0
              ? (hit.variants[0] as any)?.sku || (hit.variant_sku?.[0] ?? "")
              : (hit.variant_sku?.[0] ?? "")
            return sku ? (
              <div className="mt-0.5 mb-1">
                <span className="text-[10px] sm:text-xs text-gray-600 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                  SKU: {sku}
                </span>
              </div>
            ) : null
          })()}
          
          {/* Reserve consistent height for variants hint */}
          <div className="hidden sm:block h-4">
            {Array.isArray(hit.variants) && hit.variants.length > 1 ? (
              <p className="text-ui-fg-subtle text-[11px]">Mehrere Varianten vorhanden</p>
            ) : null}
          </div>

          {/* Price row with fixed height to align cards */}
          <div className="flex items-baseline justify-between mt-1.5 min-h-[28px] sm:min-h-[32px]">
            {cheapestPrice && (
              <div className="flex items-baseline gap-1">
                {/* Use same price component/styles as slider card */}
                <span className="text-base sm:text-lg font-bold text-ui-fg-base">
                  <PreviewPrice price={cheapestPrice} />
                </span>
              </div>
            )}
            <span className="text-[10px] sm:text-[11px] text-ui-fg-subtle">pro St.</span>
          </div>

          {/* Delivery row with fixed height for alignment */}
          <div className="mt-1 text-[11px] sm:text-[12px] min-h-[18px] sm:min-h-[20px]">
            <span className="text-ui-fg-subtle">Lieferzeit: </span>
            <span className={hasInventory ? "text-green-700" : "text-red-600"}>
              {hasInventory ? "Auf Lager" : "Nicht auf Lager"}
            </span>
          </div>
        </div>
      </LocalizedClientLink>

      {/* Bottom actions (not links) */}
      <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 mt-auto">
        <div className="mt-1.5 flex items-center gap-4 text-[12px] text-ui-fg-subtle">
          <button
            type="button"
            className="inline-flex items-center gap-2 hover:text-ui-fg-base transition-colors"
            aria-label="Vergleichen"
          >
            <ArrowsRightLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Vergleichen</span>
          </button>
          {selectedVariant && (
            <WishlistButton
              variantId={selectedVariant.id}
              productHandle={hit.handle}
              size="md"
            />
          )}
        </div>

        {/* Add to cart: always render on search page; uses variant when present or product fallback */}
        <div className="mt-2">
          <AddToCartButton
            variant={selectedVariant}
            disabled={isDisabled}
            className="w-full"
            productHandle={hit.handle}
            productId={hit.id}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default ProductHitComponent
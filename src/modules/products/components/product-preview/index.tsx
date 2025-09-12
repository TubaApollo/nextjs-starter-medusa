"use client"

import { Text } from "@medusajs/ui"
import Image from "next/image"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import WishlistButton from "@modules/common/components/wishlist-button"
import { ArrowsRightLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline"
import Select from "react-select"
import { useState } from "react"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const variants = (product.variants as any[]) || []
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null)

  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Get stock status for selected variant
  const getVariantStockStatus = (variant: any) => {
    if (!variant) return { status: "out_of_stock", quantity: 0 }
    
    if (variant?.allow_backorder) return { status: "in_stock", quantity: null }
    if (variant?.manage_inventory === false) return { status: "in_stock", quantity: null }
    
    const quantity = variant?.inventory_quantity
    if (typeof quantity !== "number") return { status: "in_stock", quantity: null }
    
    if (quantity <= 0) return { status: "out_of_stock", quantity: 0 }
    if (quantity <= 5) return { status: "low_stock", quantity }
    return { status: "in_stock", quantity }
  }

  const stockInfo = getVariantStockStatus(selectedVariant)

  const getStockDisplay = () => {
    switch (stockInfo.status) {
      case "in_stock":
        return {
          text: "Auf Lager",
          icon: <CheckCircleIcon className="w-4 h-4" />,
          color: "text-green-600",
          bgColor: "bg-green-50"
        }
      case "low_stock":
        return {
          text: "Wenige verfügbar",
          icon: <ExclamationTriangleIcon className="w-4 h-4" />,
          color: "text-orange-600",
          bgColor: "bg-orange-50"
        }
      default:
        return {
          text: "Nicht verfügbar",
          icon: <XCircleIcon className="w-4 h-4" />,
          color: "text-red-600",
          bgColor: "bg-red-50"
        }
    }
  }

  const stockDisplay = getStockDisplay()

  return (
  <div className="w-full max-w-sm sm:max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden mx-auto">
      {/* Product Image with overlays */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <LocalizedClientLink href={`/products/${product.handle}`} className="block">
          <div className="relative w-full">
            <div className="w-full pb-[100%] relative overflow-hidden">
              <Image
                src={product.thumbnail || product.images?.[0]?.url || "/api/placeholder/300/300"}
                alt={product.title}
                fill
                sizes="300px"
                priority
                style={{ objectFit: 'contain' }}
                className="transition-transform duration-200 hover:scale-105"
              />
            </div>
          </div>
        </LocalizedClientLink>
        
        {/* Stock Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${stockDisplay.bgColor} ${stockDisplay.color} flex items-center gap-1 shadow-sm`}>
          {stockDisplay.icon}
          {stockDisplay.text}
        </div>

        {/* Wishlist Button */}
        {selectedVariant && (
          <div className="absolute top-2 right-2">
            <WishlistButton
              variantId={selectedVariant.id}
              productHandle={product.handle}
              size="sm"
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white shadow-sm transition-all duration-200"
            />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <LocalizedClientLink href={`/products/${product.handle}`} className="block">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* SKU */}
        {selectedVariant?.sku && (
          <p className="text-xs text-gray-500 mb-3">
            SKU: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{selectedVariant.sku}</span>
          </p>
        )}

        {/* Modern Variants Selector */}
        {variants.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Variante:</label>
            <Select
              className="swiper-no-swiping"
              inputId={`variant-select-${product.id}`}
              instanceId={`variant-select-${product.id}`}
              value={selectedVariant ? { value: selectedVariant.id, label: selectedVariant.title || `Variante` } : null}
              onChange={(v: any) => {
                const variant = variants.find(x => x.id === v?.value)
                setSelectedVariant(variant)
              }}
              options={variants.map((variant: any) => ({ value: variant.id, label: variant.title || `Variante` }))}
              classNamePrefix="react-select"
              menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              menuPosition={'fixed'}
              styles={{
                control: (base: any) => ({ ...base, minHeight: 40, borderRadius: 8 }),
                /* Keep select menus under the sticky header */
                menuPortal: (base: any) => ({ ...base, zIndex: 40 })
              }}
            />
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4">
          {cheapestPrice && (
            <div className="flex items-baseline justify-between">
              <PreviewPrice price={cheapestPrice} region={region} />
              <span className="text-xs text-gray-500 font-medium">pro Stk.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Add to Cart Button */}
          {selectedVariant && (
            <AddToCartButton 
              variant={selectedVariant} 
              disabled={stockInfo.status === "out_of_stock"} 
              className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md" 
            />
          )}

          {/* Compare Button */}
          <button className="w-full py-2 px-3 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center gap-2 transition-all duration-200">
            <ArrowsRightLeftIcon className="w-4 h-4" />
            Vergleichen
          </button>
        </div>
      </div>
    </div>
  )
}

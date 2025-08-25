import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import { HeartIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  // Determine stock status (Auf Lager / Nicht auf Lager)
  const hasInventory = (() => {
    const variants = product.variants || []
    if (variants.length === 0) return true // be optimistic if no data
    // If any variant allows backorder or manage_inventory is false, treat as in stock
    if (variants.some((v: any) => v?.allow_backorder)) return true
    if (variants.some((v: any) => v?.manage_inventory === false)) return true
    // If inventory fields are not present, avoid false negatives
    if (!variants.some((v: any) => typeof v?.inventory_quantity === "number")) return true
    // Else check any variant qty > 0
    return variants.some((v: any) => (v?.inventory_quantity as number) > 0)
  })()

  return (
    <div
      className={`group h-full flex flex-col rounded-lg border border-ui-border-base bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${inter.className}`}
      data-testid="product-wrapper"
    >
      {/* Clickable area: image + main info */}
      <LocalizedClientLink href={`/products/${product.handle}`} className="block flex-1">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
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

          {/* SKU display */}
          {(() => {
            const first = Array.isArray(product.variants) && product.variants.length > 0 ? (product.variants[0] as any) : null
            const sku = first?.sku || ""
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
            {Array.isArray(product.variants) && product.variants.length > 1 ? (
              <p className="text-ui-fg-subtle text-[11px]">Mehrere Varianten vorhanden</p>
            ) : null}
          </div>

          {/* Price row with fixed height to align cards */}
          <div className="flex items-baseline justify-between mt-1.5 min-h-[28px] sm:min-h-[32px]">
            {cheapestPrice && (
              <div className="flex items-baseline gap-1">
                {/* Price without any prefix like 'nur' */}
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
          <button
            type="button"
            className="inline-flex items-center gap-2 hover:text-ui-fg-base transition-colors"
            aria-label="Merken"
          >
            <HeartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Merken</span>
          </button>
        </div>
        {/* Add to cart */}
        {Array.isArray(product.variants) && product.variants.length > 0 && (
          (() => {
            const variants = product.variants as any[]
            const inStock = variants.find((v) =>
              typeof v?.inventory_quantity === "number" ? (v.inventory_quantity as number) > 0 : true
            )
            const selectedVariant = (inStock || variants[0]) as any
            const isDisabled = !selectedVariant || (typeof selectedVariant?.inventory_quantity === "number" && selectedVariant.inventory_quantity < 1)
            return (
              <div className="mt-2">
                <AddToCartButton variant={selectedVariant} disabled={isDisabled} className="w-full" />
              </div>
            )
          })()
        )}
      </div>
    </div>
  )
}

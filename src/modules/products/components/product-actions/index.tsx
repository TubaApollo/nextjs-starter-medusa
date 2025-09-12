"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProductPrice from "../product-price"
import { getProductPrice } from "@lib/util/get-product-price"
import { useProductVariant } from "@lib/context/product-variant-context"
import MobileActions from "./mobile-actions"
import WishlistButton from "@modules/common/components/wishlist-button"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import { HeartIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string | null>(null)
  const [lastDelta, setLastDelta] = useState<1 | -1>(1)
  const isEditing = inputValue !== null
  const countryCode = useParams().countryCode as string
  const { setSelectedVariant } = useProductVariant()

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // expose selected variant via context
  useEffect(() => {
    setSelectedVariant(selectedVariant)
  }, [selectedVariant, setSelectedVariant])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  // compute max quantity if inventory is managed and backorder is not allowed
  const maxQuantity = useMemo(() => {
    if (!selectedVariant) return undefined as number | undefined
    if (!selectedVariant.manage_inventory) return undefined
    if (selectedVariant.allow_backorder) return undefined
    return Math.max(0, selectedVariant.inventory_quantity || 0)
  }, [selectedVariant])

  // clamp quantity when variant changes or maxQuantity decreases
  useEffect(() => {
    setQuantity((q) => {
      const min = 1
      const max = maxQuantity ?? Number.MAX_SAFE_INTEGER
      if (q < min) return min
      if (q > max) return max
      return q
    })
  }, [maxQuantity])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity || 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-end gap-4">
            <div className="text-3xl font-bold text-ui-fg-base">
              <ProductPrice product={product} variant={selectedVariant} />
            </div>
            {/* Original price / discount is rendered inside ProductPrice to avoid duplication */}
          </div>
          {/* Netto / tax hint */}
          <div className="text-sm text-ui-fg-muted">
            {(() => {
              const prices = getProductPrice({ product, variantId: selectedVariant?.id })
              const priceData = prices?.variantPrice || prices?.cheapestPrice
              if (!priceData) return null
              const netAmount = (priceData as any).net_amount
              if (netAmount) {
                return <div>Netto: {Number(netAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {priceData.currency_code}</div>
              }
              if (priceData.calculated_price_number) {
                const netto = (priceData.calculated_price_number / 1.19).toFixed(2)
                return <div>Netto: €{netto}</div>
              }
              return null
            })()}
          </div>
        </div>

        {/* Stock display */}
        <div className="mt-3">
          {selectedVariant ? (
            inStock ? (
              <div className="text-sm text-green-700">Auf Lager</div>
            ) : (
              <div className="text-sm text-red-600">Nicht verfügbar</div>
            )
          ) : (
            <div className="text-sm text-ui-fg-muted">Wähle eine Variante</div>
          )}
        </div>

        {/* Quantity selector - visible only when in stock and a valid variant is selected */}
        {inStock && selectedVariant && isValidVariant && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-ui-border-base rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-lg bg-white border-r border-ui-border-base hover:bg-ui-bg-base"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="px-6 py-2 text-center min-w-[56px]">
                  <span className="text-base font-semibold tabular-nums">{quantity}</span>
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-lg bg-white border-l border-ui-border-base hover:bg-ui-bg-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <AddToCartButton
            variant={selectedVariant}
            quantity={quantity}
            disabled={!inStock || !selectedVariant || !!disabled || !isValidVariant}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-md"
          />

          <button
            onClick={() => {
              // Placeholder for buy-now flow
            }}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm"
            data-testid="buy-now-button"
          >
            Jetzt kaufen
          </button>

          <div className="flex items-center gap-3">
            <button className="flex-1 py-2 px-4 border border-ui-border-base rounded-md bg-white text-sm flex items-center justify-center gap-2">
              <HeartIcon className="h-4 w-4" />
              Zur Wunschliste
            </button>
            <button className="flex-1 py-2 px-4 border border-ui-border-base rounded-md bg-white text-sm flex items-center justify-center gap-2">
              <ArrowsRightLeftIcon className="h-4 w-4" />
              Zur Vergleichsliste
            </button>
          </div>
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}

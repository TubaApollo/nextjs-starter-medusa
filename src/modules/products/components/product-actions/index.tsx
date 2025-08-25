"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProductPrice from "../product-price"
import { useProductVariant } from "@lib/context/product-variant-context"
import MobileActions from "./mobile-actions"

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

        <ProductPrice product={product} variant={selectedVariant} />

        {/* Quantity selector - visible only when in stock and a valid variant is selected */}
        {inStock && selectedVariant && isValidVariant && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="flex items-stretch w-full border border-ui-border-base rounded-rounded overflow-hidden bg-ui-bg-subtle">
              {(() => {
                const decDisabled = !!disabled || isAdding || quantity <= 1
                return (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setLastDelta(-1)
                      setQuantity((q) => Math.max(1, q - 1))
                    }}
                    className={`px-3 min-w-[2.5rem] h-10 flex items-center justify-center text-small-regular select-none border-r border-ui-border-base transition-colors ${
                      decDisabled
                        ? "text-ui-fg-muted cursor-not-allowed opacity-50"
                        : "text-ui-fg-base hover:bg-ui-bg-base cursor-pointer"
                    }`}
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
                    disabled={decDisabled}
                  >
                    −
                  </motion.button>
                )
              })()}

              <div
                className={`relative flex-1 h-10 flex items-center justify-center transition-colors focus-within:ring-1 focus-within:ring-ui-border-strong ${
                  isEditing ? "bg-ui-bg-base" : ""
                }`}
              >
                {!isEditing && (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={quantity}
                      initial={{ y: lastDelta > 0 ? 8 : -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: lastDelta > 0 ? -8 : 8, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-base font-medium text-ui-fg-base tabular-nums"
                      aria-live="polite"
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                )}
                {/* Transparent input overlay for manual entry */}
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`absolute inset-0 w-full h-full bg-transparent text-center text-base font-medium text-ui-fg-base tabular-nums outline-none ${
                    isEditing ? "opacity-100" : "opacity-0"
                  }`}
                  min={1}
                  max={maxQuantity}
                  value={inputValue !== null ? inputValue : String(quantity)}
                  placeholder="0"
                  onChange={(e) => {
                    const val = e.target.value
                    // Allow empty string so user can replace the value
                    if (val === "") {
                      setInputValue("")
                      return
                    }
                    // Only allow digits
                    if (!/^\d+$/.test(val)) {
                      return
                    }
                    setInputValue(val)
                  }}
                  onWheel={(e) => {
                    // prevent accidental wheel changes
                    e.currentTarget.blur()
                  }}
                  onFocus={(e) => {
                    // Enter editing mode and select text for quick overwrite
                    if (inputValue === null) {
                      setInputValue(String(quantity))
                    }
                    // Using setTimeout to ensure selection after focus paints
                    setTimeout(() => {
                      try {
                        e.currentTarget.select()
                      } catch {}
                    }, 0)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp") {
                      e.preventDefault()
                      setLastDelta(1)
                      setQuantity((q) => {
                        const max = maxQuantity ?? Number.MAX_SAFE_INTEGER
                        return Math.min(q + 1, max)
                      })
                      setInputValue(null)
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault()
                      setLastDelta(-1)
                      setQuantity((q) => Math.max(1, q - 1))
                      setInputValue(null)
                    } else if (e.key === "Enter") {
                      e.preventDefault()
                      const parsed = parseInt((inputValue ?? String(quantity)).trim(), 10)
                      const min = 1
                      const max = maxQuantity ?? Number.MAX_SAFE_INTEGER
                      const clamped = Number.isNaN(parsed)
                        ? min
                        : Math.min(Math.max(parsed, min), max)
                      setLastDelta(clamped > quantity ? 1 : -1)
                      setQuantity(clamped)
                      setInputValue(null)
                    }
                  }}
                  onBlur={() => {
                    const parsed = parseInt((inputValue ?? String(quantity)).trim(), 10)
                    const min = 1
                    const max = maxQuantity ?? Number.MAX_SAFE_INTEGER
                    const clamped = Number.isNaN(parsed)
                      ? min
                      : Math.min(Math.max(parsed, min), max)
                    setLastDelta(clamped > quantity ? 1 : -1)
                    setQuantity(clamped)
                    setInputValue(null)
                  }}
                  aria-label="Quantity"
                  title="Quantity"
                />
              </div>

              {(() => {
                const incDisabled =
                  !!disabled ||
                  isAdding ||
                  (maxQuantity !== undefined && quantity >= maxQuantity)
                return (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setLastDelta(1)
                      setQuantity((q) => {
                        const max = maxQuantity ?? Number.MAX_SAFE_INTEGER
                        return Math.min(q + 1, max)
                      })
                    }}
                    className={`px-3 min-w-[2.5rem] h-10 flex items-center justify-center text-small-regular select-none border-l border-ui-border-base transition-colors ${
                      incDisabled
                        ? "text-ui-fg-muted cursor-not-allowed opacity-50"
                        : "text-ui-fg-base hover:bg-ui-bg-base cursor-pointer"
                    }`}
                    aria-label="Increase quantity"
                    title="Increase quantity"
                    disabled={incDisabled}
                  >
                    +
                  </motion.button>
                )
              })()}
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
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

"use client"

import React, { useEffect, useState } from "react"
import { addToCart } from "@lib/data/cart"
import { useParams, usePathname, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline"

interface AddToCartButtonProps {
  variant?: HttpTypes.StoreProductVariant | null
  quantity?: number
  disabled?: boolean
  className?: string
  productHandle?: string
  productId?: string
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  variant,
  quantity = 1,
  disabled = false,
  className = "",
  productHandle,
  productId,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { countryCode } = useParams<{ countryCode?: string }>()
  const pathname = usePathname()
  const countryFromPath = (pathname?.split("/")[1] || "us").toLowerCase()
  const router = useRouter()

  const handleAddToCart = async () => {
    if (disabled || isAdding) return
    if (!variant?.id && !productHandle && !productId) return

    setIsAdding(true)

    try {
      // Prefer server action when we have a concrete variant id (matches PDP behavior and overlay updates)
      if (variant?.id) {
        await addToCart({
          variantId: variant.id,
          quantity: quantity,
          countryCode: (countryCode || countryFromPath) as string,
        })
      } else if (productId || productHandle) {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productHandle,
            productId,
            quantity,
            countryCode: (countryCode || countryFromPath) as string,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || `HTTP ${res.status}`)
        }
      }
      setIsSuccess(true)
      // Ensure UI reflects latest cart and open the cart dropdown
      try {
        router.refresh()
      } catch {}
      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(new CustomEvent("open-cart-dropdown"))
        } catch {}
      }
      // Auto-reset success after a short delay
      setTimeout(() => setIsSuccess(false), 2000)
    } catch (error) {
      // eslint-disable-next-line no-console
      const err = error as any
      const message = err?.message || String(err) || "Unknown error"
      console.error("Error adding to cart:", {
        message,
        variantId: variant?.id,
        countryCode: countryCode || countryFromPath,
        productHandle,
        productId,
      })
      if (typeof window !== "undefined") {
        // minimal user feedback without external deps
        alert(`Fehler beim Hinzufügen zum Warenkorb: ${message}`)
      }
    } finally {
      setIsAdding(false)
    }
  }

  const btnDisabled = disabled || isAdding || (!variant?.id && !productHandle && !productId)

  return (
    <motion.button
      type="button"
      onClick={handleAddToCart}
      disabled={btnDisabled}
      whileTap={!btnDisabled ? { scale: 0.98 } : undefined}
      className={`
        w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
        ${btnDisabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : isSuccess ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"}
        ${className}
      `}
      aria-label={isAdding ? "Wird hinzugefügt" : isSuccess ? "Hinzugefügt" : "Zum Warenkorb hinzufügen"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <CheckIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Hinzugefügt!</span>
          </motion.span>
        ) : (
          <motion.span
            key={isAdding ? "adding" : "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="hidden sm:inline">{isAdding ? "Wird hinzugefügt..." : "Zum Warenkorb hinzufügen"}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default AddToCartButton

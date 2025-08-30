"use client"

import { convertToLocale } from "@lib/util/money"
import React, { useMemo } from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  // Derive a net items subtotal (excluding shipping and taxes)
  // Fallback formula if backend subtotal includes shipping/tax: itemsNet = total - shipping - taxes
  const itemsNet = useMemo(() => {
    const t = typeof total === "number" ? total : 0
    const ship = typeof shipping_subtotal === "number" ? shipping_subtotal : 0
    const tax = typeof tax_total === "number" ? tax_total : 0
    // Prefer provided subtotal if it is <= (total - ship) (assume it doesn't include shipping)
    const provided = typeof subtotal === "number" ? subtotal : undefined
    const derived = Math.max(0, t - ship - tax)
    // If provided subtotal seems to include shipping (greater than derived), use derived
    if (typeof provided === "number") {
      return provided > derived ? derived : provided
    }
    return derived
  }, [total, shipping_subtotal, tax_total, subtotal])

  const discount = typeof discount_total === "number" ? discount_total : 0
  const gift = typeof gift_card_total === "number" ? gift_card_total : 0
  const shipping = typeof shipping_subtotal === "number" ? shipping_subtotal : 0
  const taxes = typeof tax_total === "number" ? tax_total : 0

  // Net total before tax (items net - discounts - gift + shipping)
  const netTotal = useMemo(() => {
    return Math.max(0, itemsNet - discount - gift + shipping)
  }, [itemsNet, discount, gift, shipping])

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">Zwischensumme netto</span>
          <span data-testid="cart-subtotal" data-value={itemsNet}>
            {convertToLocale({ amount: itemsNet, currency_code })}
          </span>
        </div>
        {!!discount && (
          <div className="flex items-center justify-between">
            <span>Rabatt</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount}
            >
              - {convertToLocale({ amount: discount, currency_code })}
            </span>
          </div>
        )}
        {!!gift && (
          <div className="flex items-center justify-between">
            <span>Gutschein</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift}
            >
              - {convertToLocale({ amount: gift, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Versandkosten</span>
          <span data-testid="cart-shipping" data-value={shipping}>
            {convertToLocale({ amount: shipping, currency_code })}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-1 txt-medium ">
        <span>Gesamtsumme netto</span>
        <span className="txt-large" data-testid="cart-total-net" data-value={netTotal}>
          {convertToLocale({ amount: netTotal, currency_code })}
        </span>
      </div>
      <div className="flex items-center justify-between text-ui-fg-subtle mb-2 txt-medium ">
        <span>zzgl. MwSt.</span>
        <span data-testid="cart-taxes" data-value={taxes}>
          {convertToLocale({ amount: taxes, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 font-semibold ">
        <span>Gesamtsumme brutto</span>
        <span className="txt-xlarge-plus" data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-2" />
    </div>
  )
}

export default CartTotals

"use client"

import { convertToLocale } from "@lib/util/money"
import React, { useMemo } from "react"
import { Badge } from "@medusajs/ui"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    item_total?: number | null
    shipping_subtotal?: number | null
    shipping_methods?: {adjustments?: {amount: number}[]}[]
    items?: {adjustments?: {amount: number}[]}[]
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    gift_card_total,
    item_subtotal,
    item_total,
    shipping_subtotal,
    shipping_total,
    shipping_methods,
    items
  } = totals

  // derived values used in the template
  const gift = gift_card_total ?? 0
  const shipping = shipping_total ?? shipping_subtotal ?? 0
  const netTotal = (total ?? 0) - (tax_total ?? 0)
  const taxes = tax_total ?? 0

  const totalItemDiscount = items?.flatMap(i => i.adjustments).reduce((acc, curr) => (curr?.amount || 0) + acc, 0)
  const totalShippingDiscount = shipping_methods?.flatMap(sm => sm.adjustments).reduce((acc, curr) => (curr?.amount || 0) + acc, 0)

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>Subtotal (excl. shipping and taxes)</span>
          <div className="flex items-center gap-2">
            <span className={totalItemDiscount ? 'line-through text-ui-fg-muted' : ''} data-testid="cart-item-subtotal" data-value={item_subtotal || 0}>
              {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
            </span>
            {!!totalItemDiscount && (
              <div className="flex items-center justify-between">
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={item_total || 0}
            >
              {convertToLocale({ amount: item_total ?? 0, currency_code })}
            </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <div className="flex items-center gap-2">
            <span className={totalShippingDiscount ? 'line-through text-ui-fg-muted' : ''} data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
              {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
            </span>
            {!!totalShippingDiscount && (
              <span
                className="text-ui-fg-interactive"
                data-testid="cart-shipping-discount"
                data-value={shipping_total || 0}
              >
              {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
            </span>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
        {!!gift_card_total && (
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

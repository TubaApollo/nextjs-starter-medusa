"use client"

import { Separator } from "@lib/components/ui/separator"
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
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Zwischensumme netto</span>
          <span className="font-medium" data-testid="cart-subtotal" data-value={itemsNet}>
            {convertToLocale({ amount: itemsNet, currency_code })}
          </span>
        </div>
        
        {!!discount && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Rabatt</span>
            <span className="text-green-600 font-medium" data-testid="cart-discount" data-value={discount}>
              - {convertToLocale({ amount: discount, currency_code })}
            </span>
          </div>
        )}
        
        {!!gift && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Gutschein</span>
            <span className="text-green-600 font-medium" data-testid="cart-gift-card-amount" data-value={gift}>
              - {convertToLocale({ amount: gift, currency_code })}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Versandkosten</span>
          <span className="font-medium" data-testid="cart-shipping" data-value={shipping}>
            {convertToLocale({ amount: shipping, currency_code })}
          </span>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Gesamtsumme netto</span>
          <span className="text-lg font-semibold" data-testid="cart-total-net" data-value={netTotal}>
            {convertToLocale({ amount: netTotal, currency_code })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">zzgl. MwSt.</span>
          <span className="font-medium" data-testid="cart-taxes" data-value={taxes}>
            {convertToLocale({ amount: taxes, currency_code })}
          </span>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">Gesamtsumme brutto</span>
        <span className="text-2xl font-bold" data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals

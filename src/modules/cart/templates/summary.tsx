"use client"

import { Button } from "@lib/components/ui/button"
import { Separator } from "@lib/components/ui/separator"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Zusammenfassung</h2>
      
      <DiscountCode cart={cart} />
      
      <Separator />
      
      <CartTotals totals={cart} />
      
      <LocalizedClientLink href={"/checkout?step=" + step} className="block">
        <Button 
          className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white border-0"
          data-testid="checkout-button"
        >
          Zur Kasse
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary

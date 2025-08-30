"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import SectionHeader from "@modules/checkout/components/section-header"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <SectionHeader title="Überprüfung" index={4} isOpen={isOpen} completed={!isOpen} />
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Durch Klicken auf die Schaltfläche "Bestellung abschicken" bestätigen Sie, dass Sie unsere Nutzungsbedingungen, Verkaufsbedingungen und Rückgaberichtlinien gelesen, verstanden und akzeptiert haben und bestätigen, dass Sie die Datenschutzbestimmungen des Medusa-Shops gelesen haben.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review

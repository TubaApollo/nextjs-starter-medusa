import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import CheckoutSteps from "@modules/checkout/components/checkout-steps"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="content-container h-full max-w-6xl mx-auto py-12">
      <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] gap-x-40">
        <main className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <CheckoutSteps />
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </main>

        <aside className="w-full">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 sticky top-12 mt-6 md:mt-0">
            <CheckoutSummary cart={cart} />
          </div>
        </aside>
      </div>
    </div>
  )
}

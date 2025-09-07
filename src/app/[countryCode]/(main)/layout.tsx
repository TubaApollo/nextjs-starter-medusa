import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption, StoreRegion } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import TopBar from "@modules/layout/components/top-bar"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { ModalProvider } from "@lib/context/modal-context"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode; params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  // Only retrieve existing cart - don't create one here to avoid cookie modification in layout
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      <TopBar regions={regions} />
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
    </>
  )
}

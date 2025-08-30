import SectionHeader from "@modules/checkout/components/section-header"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-0">
      <div className="w-full flex flex-col">
  <SectionHeader title="In Ihrem Warenkorb" />
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <div className="overflow-hidden">
          <ItemsPreviewTemplate cart={cart} />
        </div>
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary

"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import { Card, CardContent } from "@lib/components/ui/card"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
  <h1 className="text-2xl-semi">Bestelldetails</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <XMark /> Zur Übersicht
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <Card>
          <CardContent className="p-6">
            <OrderDetails order={order} showStatus />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Items order={order} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div>
                <ShippingDetails order={order} />
              </div>
              <div>
                <OrderSummary order={order} />
                <Help />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const addr = (order.shipping_address || {}) as any

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Lieferung
      </Heading>
      <div className="flex flex-col gap-6">
        <div
          className="flex flex-col min-w-0"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Lieferadresse
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {addr.first_name} {addr.last_name}
          </Text>
          {addr.address_1 ? (
            <Text className="txt-medium text-ui-fg-subtle">{addr.address_1}</Text>
          ) : null}
          {addr.address_2 ? (
            <Text className="txt-medium text-ui-fg-subtle">{addr.address_2}</Text>
          ) : null}
          <Text className="txt-medium text-ui-fg-subtle">
            {addr.postal_code}{addr.postal_code ? ", " : ""}{addr.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {addr.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col min-w-0"
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Kontakt</Text>
          <Text className="txt-medium text-ui-fg-subtle">{addr.phone}</Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="flex flex-col min-w-0"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Versandart</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails


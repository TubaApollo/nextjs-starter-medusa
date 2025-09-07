import { Button } from "@lib/components/ui/button"
import { Badge } from "@lib/components/ui/badge"
import { Card, CardContent } from "@lib/components/ui/card"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  const formatStatus = (str?: string) => {
    if (!str) return "-"
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const mapFulfillmentStatus = (s?: string) => {
    if (!s) return { label: "-", variant: "secondary" }
    switch (s) {
      case "fulfilled":
        return { label: "Versendet", variant: "default" }
      case "partially_fulfilled":
        return { label: "Teilweise versendet", variant: "secondary" }
      case "not_fulfilled":
        return { label: "Nicht versendet", variant: "secondary" }
      case "canceled":
      case "cancelled":
        return { label: "Storniert", variant: "destructive" }
      default:
        return { label: formatStatus(s), variant: "secondary" }
    }
  }

  const mapPaymentStatus = (s?: string) => {
    if (!s) return { label: "-", variant: "secondary" }
    switch (s) {
      case "captured":
        return { label: "Bezahlt", variant: "default" }
      case "authorized":
        return { label: "Autorisiert", variant: "secondary" }
      case "requires_action":
        return { label: "Erfordert Aktion", variant: "secondary" }
      case "refunded":
        return { label: "Erstattet", variant: "secondary" }
      case "canceled":
      case "cancelled":
        return { label: "Storniert", variant: "destructive" }
      default:
        return { label: formatStatus(s), variant: "secondary" }
    }
  }

  const fulfillment = mapFulfillmentStatus(order.fulfillment_status)
  const payment = mapPaymentStatus(order.payment_status)

  return (
    <Card data-testid="order-card" className="shadow-sm">
      <CardContent className="p-6">
  <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 md:col-span-2">
            {/* clickable main thumbnail like wishlist/cart */}
              <LocalizedClientLink href={`/products/${(order.items?.[0] as any)?.variant?.product?.handle || (order.items?.[0] as any)?.product_handle || ''}`} className="block">
                <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                  {order.items?.[0] ? (
                    <Thumbnail thumbnail={order.items[0].thumbnail} images={[]} size="square" />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded" />
                  )}
                </div>
              </LocalizedClientLink>
              <div className="mt-2 text-sm text-ui-fg-base min-w-0">
                <span className="font-semibold block truncate">{order.items?.[0]?.title}</span>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7">
              <div className="uppercase text-large-semi mb-1">#{order.display_id}</div>
              <div className="flex items-center gap-x-4 text-sm text-ui-fg-base">
                <span data-testid="order-created-at">{new Date(order.created_at).toLocaleDateString("de-DE", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span data-testid="order-amount">{convertToLocale({ amount: order.total, currency_code: order.currency_code })}</span>
                <span>{`${numberOfLines} Artikel`}</span>
              </div>
              {/* show SKU of first item aligned with order meta */}
              <div className="mt-2 text-xs text-ui-fg-muted">
                {(() => {
                  const first = order.items?.[0]
                  const firstSku = (first as any)?.variant?.sku || (first as any)?.product_variant?.sku || (first as any)?.sku
                  return firstSku ? <span>SKU: {firstSku}</span> : null
                })()}
              </div>

              <div className="mt-2">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:block">
                    <div className="flex gap-3">
                      {order.items?.slice(1, 4).map((i) => (
                        <LocalizedClientLink key={i.id} href={`/products/${(i as any)?.variant?.product?.handle || (i as any)?.product_handle || ''}`} className="block">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                                  <Thumbnail thumbnail={i.thumbnail} images={[]} size="square" />
                                </div>
                        </LocalizedClientLink>
                      ))}
                    </div>
                  </div>

                  <div>
                    <ul className="space-y-2">
                      {order.items?.map((it) => {
                        const sku = (it as any)?.variant?.sku || (it as any)?.product_variant?.sku || (it as any)?.sku
                        return (
                          <li key={it.id} className="text-sm min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 text-right text-ui-fg-muted flex-shrink-0">{it.quantity}x</div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                                  <span className="font-semibold text-ui-fg-base truncate">{it.title}</span>
                                  {it.subtitle && (
                                    <span className="text-xs text-ui-fg-muted truncate">{it.subtitle}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>

                    {numberOfProducts > 4 && (
                      <div className="mt-3 text-small-regular text-muted">+ {numberOfProducts - 4} weitere Artikel</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 flex flex-col items-end gap-4 justify-between h-full">
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2 items-center">
                  <div className="text-sm text-ui-fg-base">Bestellstatus:</div>
                  <Badge className="whitespace-nowrap min-w-[96px] justify-center text-center px-3 py-1" variant={(fulfillment.variant as any)} data-testid="order-status-badge">{fulfillment.label}</Badge>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="text-sm text-ui-fg-base">Zahlungsstatus:</div>
                  <Badge className="whitespace-nowrap min-w-[96px] justify-center text-center px-3 py-1" variant={(payment.variant as any)} data-testid="payment-status-badge">{payment.label}</Badge>
                </div>
              </div>

              <div className="mt-auto">
                <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                  <Button data-testid="order-details-link" variant="secondary">Details ansehen</Button>
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

export default OrderCard

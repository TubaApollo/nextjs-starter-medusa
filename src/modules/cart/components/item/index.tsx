"use client"

import { Badge } from "@lib/components/ui/badge"
import { Card, CardContent } from "@lib/components/ui/card"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Card className="mb-4" data-testid="product-row">
      <CardContent className="p-4 flex gap-4 items-center">
        <LocalizedClientLink href={`/products/${item.product_handle}`} className="block">
          <div className="w-20 h-20 small:w-24 small:h-24">
            <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
          </div>
        </LocalizedClientLink>

        <div className="flex-1">
          <LocalizedClientLink href={`/products/${item.product_handle}`} className="block">
            <div className="text-lg font-medium text-ui-fg-base" data-testid="product-title">
              {item.product_title}
            </div>
          </LocalizedClientLink>
          {item.variant?.sku && (
            <Badge variant="secondary" className="mt-1 mb-1 text-xs">
              SKU: {item.variant.sku}
            </Badge>
          )}
          <div className="mt-1">
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
          </div>
        </div>

        <div className="flex flex-col items-end justify-between w-36">
          <div className="flex items-center gap-2">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-2"
              data-testid="product-select-button"
            >
              {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>

          <div className="text-right">
            <div className="hidden small:block">
              <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
            </div>
            <div className="font-semibold mt-2">
              <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
            </div>
          </div>

          <ErrorMessage error={error} data-testid="product-error-message" />
        </div>
      </CardContent>
    </Card>
  )
}

export default Item

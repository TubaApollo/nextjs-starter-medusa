import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <div className="flex items-center gap-4 w-full" data-testid="product-row">
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-muted">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <Text className="txt-medium-plus text-ui-fg-base truncate" data-testid="product-name">
          {item.product_title}
        </Text>
        <div className="text-sm text-ui-fg-subtle mt-1">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-baseline gap-2">
          <Text className="text-ui-fg-muted mr-1">
            <span data-testid="product-quantity">{item.quantity}</span>x
          </Text>
          <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
        </div>
        <div>
          <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
        </div>
      </div>
    </div>
  )
}

export default Item

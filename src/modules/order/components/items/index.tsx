import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { Card, CardContent } from "@lib/components/ui/card"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col">
      <div className="space-y-4" data-testid="products-list">
        {items?.length
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <Item item={item} currencyCode={order.currency_code} />
                    </CardContent>
                  </Card>
                )
              })
          : repeat(5).map((i) => {
              return (
                <Card key={i}>
                  <CardContent className="p-4">
                    <SkeletonLineItem />
                  </CardContent>
                </Card>
              )
            })}
      </div>
    </div>
  )
}

export default Items

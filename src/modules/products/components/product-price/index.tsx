import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const formatWithComma = (value: number | string) => {
    // try to handle numbers or already formatted strings
    const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]+/g, ''))
    if (isNaN(num)) return String(value)
    // format with 2 decimals and comma decimal separator
    return num.toFixed(2).replace('.', ',')
  }

  const currencyAfter = (value: number | string, currency = '€') => {
    return `${formatWithComma(value)} ${currency}`
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-2xl font-extrabold", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "Ab "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {currencyAfter(selectedPrice.calculated_price_number ?? selectedPrice.calculated_price)}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <div className="mt-1">
          <p className="text-sm">
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through font-semibold"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {currencyAfter(selectedPrice.original_price_number ?? selectedPrice.original_price)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

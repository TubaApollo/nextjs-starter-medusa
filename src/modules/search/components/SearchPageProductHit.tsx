"use client"

import React from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Highlight } from "react-instantsearch"
import { ProductHit } from "../../../../types/search"

interface SearchPageProductHitProps {
  hit: ProductHit
}

const SearchPageProductHit = ({ hit }: SearchPageProductHitProps) => {
  const formatPrice = (price: any): string => {
    if (!price || price <= 0) return "Price on request"
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const content = (
    <motion.div className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={hit.thumbnail ?? undefined}
          images={[]}
          size="full"
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <h3 className="text-ui-fg-subtle font-medium line-clamp-2">
            <Highlight attribute="title" hit={hit} />
          </h3>
          <div className="flex items-center gap-x-2">
            {hit.min_price ? (
              <div className="text-ui-fg-base font-semibold">
                {formatPrice(hit.min_price)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  )

  if (!hit?.handle) return content

  return (
    <LocalizedClientLink href={`/products/${hit.handle}`} className="group block">
      {content}
    </LocalizedClientLink>
  )
}

export default SearchPageProductHit

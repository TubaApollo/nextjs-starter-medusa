"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Highlight } from "react-instantsearch"

import { ProductHit } from "../../../../types/search"

interface ProductHitProps {
  hit: ProductHit
}

const ProductHitComponent = ({ hit }: ProductHitProps) => {
  console.log("Product Hit:", hit);
  const formatPrice = (price: any): string => {
    if (!price || price <= 0) return "Price on request"
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <Link href={`/products/${hit.handle}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
      >
        <div className="flex-shrink-0">
          {hit.thumbnail ? (
            <Image
              src={hit.thumbnail}
              alt={hit.title}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
            {hit.title}
          </h4>
          {hit.variant_sku && hit.variant_sku.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Artikelnummer: {hit.variant_sku[0]}
            </p>
          )}
          {hit.variants && hit.variants.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {hit.variants[0].title}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {hit.min_price && (
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {formatPrice(hit.min_price ?? undefined)}
            </div>
          )}
          {hit.variants && hit.variants.length > 0 && !hit.min_price && (
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {formatPrice(hit.variants[0].prices[0].amount)}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductHitComponent
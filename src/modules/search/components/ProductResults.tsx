"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import React, { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useHits, useSearchBox } from "react-instantsearch"

import { ProductHit } from "../../../../types/search"
import ProductHitComponent from "./ProductHit"


const ProductResults = () => {
  const { hits } = useHits()
  const pathname = usePathname()
  const { query } = useSearchBox()

  const hitsArray = Array.isArray(hits) ? hits : []
  const displayLimit = query.trim() ? 10 : 20 // Show more results for empty queries
  const hasMoreResults = hitsArray.length > displayLimit
  const displayedHits = hitsArray.slice(0, displayLimit)

  const effectiveQuery = query.trim()

  // No parent state updates here to avoid render loops; parent uses ResultsTracker

  if (hitsArray.length === 0 && !effectiveQuery) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No products available.</p>
      </div>
    )
  }

  if (hitsArray.length === 0) {
    return null
  }

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        className="grid grid-cols-1 gap-2"
      >
        {displayedHits.map((hit, index) => {
          const productHit: ProductHit = {
            id: hit.objectID,
            objectID: hit.objectID,
            title: hit.title,
            handle: hit.handle,
            description: hit.description ?? null,
            thumbnail: hit.thumbnail ?? null,
            min_price: hit.min_price ?? null,
            variant_sku: hit.variant_sku ?? [],
            variants: hit.variants ?? [],
            __position: hit.__position,
            __queryID: hit.__queryID,
          };
          return (
            <motion.div
              key={hit.objectID || `product-hit-${index}`}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
            >
                <ProductHitComponent hit={productHit} />
            </motion.div>
          )
        })}
      </motion.div>
      
      {hasMoreResults && effectiveQuery && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href={`/${(pathname?.split('/')[1] || 'us')}/search?query=${encodeURIComponent(effectiveQuery)}`}
            className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Show all {hitsArray.length} products →
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProductResults

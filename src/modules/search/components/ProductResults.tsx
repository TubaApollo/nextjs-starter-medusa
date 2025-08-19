"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import React from "react"
import { useHits } from "react-instantsearch"

import { ProductHit } from "../../../../types/search"
import ProductHitComponent from "./ProductHit"

const ProductResults = () => {
  const { hits } = useHits()

  if (hits.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No products found.
      </p>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="grid grid-cols-1 gap-2"
    >
      {hits.map((hit, index) => {
        const 
        : ProductHit = {
          id: hit.objectID,
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
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
              <ProductHitComponent hit={productHit} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default ProductResults
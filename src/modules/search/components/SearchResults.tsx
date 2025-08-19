"use client"

import { motion } from "framer-motion"
import React from "react"
import { Index, useInstantSearch } from "react-instantsearch"
import { SearchResults as InstantSearchResults } from "instantsearch.js/es/lib/SearchResults"

import CategoryResults from "./CategoryResults"
import NoResults from "./NoResults"
import ProductResults from "./ProductResults"

const SearchResults = () => {
  const { results } = useInstantSearch()

  const hasResults =
    results &&
    (results.nbHits > 0 ||
      (results._rawResults &&
        Array.isArray(results._rawResults) &&
        results._rawResults.some((r: any) => r.nbHits > 0)))

  if (!hasResults) {
    return <NoResults />
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Products
          </h3>
          <Index
            indexName={
              process.env.NEXT_PUBLIC_MEILISEARCH_PRODUCTS_INDEX || "products"
            }
          >
            <ProductResults />
          </Index>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Categories
          </h3>
          <Index
            indexName={
              process.env.NEXT_PUBLIC_MEILISEARCH_CATEGORIES_INDEX ||
              "product_categories"
            }
          >
            <CategoryResults />
          </Index>
        </motion.div>
      </div>
    </div>
  )
}

export default SearchResults
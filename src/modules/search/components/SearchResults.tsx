"use client"

import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { Index, useHits, useSearchBox } from "react-instantsearch"
import { SEARCH_INDEX_NAME, CATEGORY_INDEX_NAME } from "@lib/search-client"

import CategoryResults from "./CategoryResults"
import NoResults from "./NoResults"
import ProductResults from "./ProductResults"

const SearchResults = () => {
  const { query } = useSearchBox()
  const productsIndexName = SEARCH_INDEX_NAME
  const categoriesIndexName = CATEGORY_INDEX_NAME

  const effectiveQuery = (query || '').trim()
  if (!effectiveQuery) {
    return null
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800">
        {/* Products column */}
        <Index indexName={productsIndexName}>
          <ProductResults />
        </Index>

        {/* Categories column */}
        <Index indexName={categoriesIndexName}>
          <CategoryResults />
        </Index>
      </div>
      {/* NoResults will be handled inside Product/Category results if needed */}
    </div>
  )
}

export default SearchResults
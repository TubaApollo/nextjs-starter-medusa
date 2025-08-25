"use client"

import { motion, AnimatePresence } from "framer-motion"
import React, { useState, useEffect } from "react"
import { Index, useHits, useSearchBox, useInstantSearch } from "react-instantsearch"
import { SEARCH_INDEX_NAME, CATEGORY_INDEX_NAME } from "@lib/search-client"

import CategoryResults from "./CategoryResults"
import NoResults from "./NoResults"
import ProductResults from "./ProductResults"

const SearchResults = () => {
  const { query } = useSearchBox()
  const { status, indexUiState } = useInstantSearch()
  const productsIndexName = SEARCH_INDEX_NAME
  const categoriesIndexName = CATEGORY_INDEX_NAME

  const effectiveQuery = (query || '').trim()
  const isLoading = status === 'loading' || status === 'stalled'
  
  // Ensure the search client doesn't filter when there's no query
  useEffect(() => {
    if (!effectiveQuery && indexUiState.configure?.filters) {
      indexUiState.configure.filters = ''
    }
  }, [effectiveQuery, indexUiState])

  // For empty queries, we still want to show results (all products)
  // The search client handles this by setting query to undefined for empty searches

  return (
    <div className="w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {effectiveQuery ? 'Products' : 'All Products'}
          </h3>
          <Index indexName={productsIndexName}>
            <ProductResults />
          </Index>
        </div>

        {/* Categories column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Categories
          </h3>
          <Index indexName={categoriesIndexName}>
            <CategoryResults />
          </Index>
        </div>
      </div>

      {/* No Results State */}
      {!isLoading && effectiveQuery && (
        <Index indexName={productsIndexName}>
          <NoResultsQuery />
        </Index>
      )}
    </div>
  )
}

// Component to handle no results for queries
const NoResultsQuery = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()
  const effectiveQuery = (query || '').trim()

  if (!effectiveQuery || hits.length > 0) {
    return null
  }

  return (
    <div className="col-span-full py-12">
      <NoResults />
    </div>
  )
}

export default SearchResults

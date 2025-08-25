"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  InstantSearch,
  Index,
  Configure,
  SearchBox,
  Hits,
  RefinementList,
  RangeInput,
  Highlight,
  ClearRefinements,
  useSearchBox,
  useInstantSearch,
  UseRefinementListProps,
} from "react-instantsearch"
import { Hit } from "instantsearch.js"
import { useMediaQuery } from "@lib/hooks/use-media-query"
import { searchClient, SEARCH_INDEX_NAME, CATEGORY_INDEX_NAME } from "@lib/search-client"
import { ProductHit, CategoryHit } from "../../../../types/search"
import ProductPreview from "@modules/products/components/product-preview"
import Link from "next/link"
import CategoryHitComponent from "@modules/search/components/CategoryHit"
import ProductHitComponent from "@modules/search/components/ProductHit"
import InfiniteHits from "@modules/search/components/InfiniteHits"

// URL synchronization component for search query
const UrlSync = ({ initialQuery }: { initialQuery: string }) => {
  const { query } = useSearchBox()
  const router = useRouter()

  useEffect(() => {
    if (query !== initialQuery) {
      const url = new URL(window.location.href)
      if (query.trim()) {
        url.searchParams.set("query", query)
      } else {
        url.searchParams.delete("query")
      }
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [query, initialQuery, router])

  return null
}

// Search input component that syncs with URL
const SearchInputComponent = () => {
  const { refine } = useSearchBox()
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const query = searchParams.get("query") || ""
    refine(query)
  }, [refine])

  return (
    <SearchBox
      placeholder="Search products and categories..."
      classNames={{
        root: "relative",
        form: "relative",
        input: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500",
        submit: "absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700",
        reset: "absolute right-10 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700",
        loadingIndicator: "absolute right-16 top-1/2 -translate-y-1/2 p-2"
      }}
      autoFocus={false}
    />
  )
}

// Product price filter component
const PriceFilter = () => {
  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
      <RangeInput
        attribute="min_price"
        min={0}
        precision={0}
        classNames={{
          root: "space-y-4",
          form: "flex items-center space-x-2",
          input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500",
          submit: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
        }}
      />
    </div>
  )
}

// Product tags filter component
const TagsFilter = () => {
  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Tags</h3>
      <RefinementList 
        attribute="tag_ids"
        limit={10}
        showMore={true}
        showMoreLimit={20}
        searchable={true}
        searchablePlaceholder="Search tags..."
        classNames={{
          root: "",
          searchBox: "mb-2",
          list: "space-y-2",
          item: "flex items-center",
          label: "flex items-center cursor-pointer",
          checkbox: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2",
          labelText: "ml-2 text-sm text-gray-700",
          count: "ml-1 text-xs text-gray-500 font-normal",
          showMore: "text-sm text-blue-600 hover:text-blue-800 mt-1"
        }}
      />
    </div>
  )
}

// Parent category filter for category index
const ParentCategoryFilter = () => {
  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Parent Category</h3>
      <RefinementList
        attribute="parent_category_id"
        limit={10}
        showMore={true}
        showMoreLimit={20}
        classNames={{
          root: "",
          list: "space-y-2",
          item: "flex items-center",
          label: "flex items-center cursor-pointer",
          checkbox: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2",
          labelText: "ml-2 text-sm text-gray-700",
          count: "ml-1 text-xs text-gray-500 font-normal",
          showMore: "text-sm text-blue-600 hover:text-blue-800 mt-1"
        }}
      />
    </div>
  )
}

// Category filters for category index
const CategoryFilters = () => {
  return (
    <div className="border-b border-gray-200 py-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Category Properties</h3>
      <RefinementList
        attribute="handle"
        limit={15}
        showMore={true}
        showMoreLimit={30}
        searchable={true}
        searchablePlaceholder="Search categories..."
        classNames={{
          root: "",
          searchBox: "mb-2",
          list: "space-y-2",
          item: "flex items-center",
          label: "flex items-center cursor-pointer",
          checkbox: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2",
          labelText: "ml-2 text-sm text-gray-700",
          count: "ml-1 text-xs text-gray-500 font-normal",
          showMore: "text-sm text-blue-600 hover:text-blue-800 mt-1"
        }}
      />
    </div>
  )
}

const ImprovedSearchPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')
  const [filterOpen, setFilterOpen] = useState(false)
  const isSmallScreen = !useMediaQuery('(min-width: 1024px)')
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({})
  const [collectionMap, setCollectionMap] = useState<Record<string, string>>({})
  const [sortOption, setSortOption] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/search-maps')
        if (!res.ok) return
        const json = await res.json()
        if (!mounted) return
        setCategoryMap(json.categoryMap || {})
        setCollectionMap(json.collectionMap || {})
      } catch (e) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <InstantSearch 
        searchClient={searchClient} 
        indexName={SEARCH_INDEX_NAME}
        routing={false}
      >
        {/* clear Configure filters when no query to avoid MeiliSearch facet errors */}
        <Configure {...({ filters: query.trim() ? undefined : '' } as any)} />
        
        {/* Page Header and Search Input */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {query ? `Search Results for "${query}"` : "Browse Products"}
          </h1>
          <div className="max-w-2xl mb-6">
            <SearchInputComponent />
          </div>
          <UrlSync initialQuery={query} />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'products' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'categories' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        {isSmallScreen && (
          <div className="mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              {filterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {activeTab === 'products' ? (
            <Index indexName={SEARCH_INDEX_NAME}>
              {/* Filters Column - Desktop */}
              {(!isSmallScreen || filterOpen) && (
                <div className={`${isSmallScreen ? 'mb-6' : 'lg:col-span-3'}`}>
                  <div className="sticky top-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <ClearRefinements 
                          translations={{ resetButtonText: 'Clear all' }}
                          classNames={{ button: 'text-sm text-blue-600 hover:text-blue-800', disabledButton: 'text-sm text-gray-400' }}
                        />
                      </div>
                      <PriceFilter />
                      <div className="border-b border-gray-200 py-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Categories</h3>
                        <RefinementList
                          attribute="category_ids"
                          limit={20}
                          showMore={true}
                          showMoreLimit={50}
                          searchable={true}
                          searchablePlaceholder="Search categories..."
                          transformItems={(items) => items.map((item: any) => ({
                            ...item,
                            label: categoryMap[item.value] || item.label || String(item.value)
                          })).sort((a: any, b: any) => (a.label || '').localeCompare(b.label || ''))}
                          classNames={{
                            root: "",
                            searchBox: "mb-2",
                            list: "space-y-2",
                            item: "flex items-center",
                            label: "flex items-center cursor-pointer",
                            checkbox: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2",
                            labelText: "ml-2 text-sm text-gray-700",
                            count: "ml-1 text-xs text-gray-500 font-normal",
                            showMore: "text-sm text-blue-600 hover:text-blue-800 mt-1"
                          }}
                        />
                      </div>
                      <div className="border-b border-gray-200 py-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Collections</h3>
                        <RefinementList 
                          attribute="collection_id"
                          limit={10}
                          showMore={true}
                          showMoreLimit={20}
                          searchable={true}
                          searchablePlaceholder="Search collections..."
                          transformItems={(items) => items.map((item: any) => ({
                            ...item,
                            label: collectionMap[item.value] || item.label || String(item.value)
                          })).sort((a: any, b: any) => (a.label || '').localeCompare(b.label || ''))}
                          classNames={{
                            root: "",
                            searchBox: "mb-2",
                            list: "space-y-2",
                            item: "flex items-center",
                            label: "flex items-center cursor-pointer",
                            checkbox: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2",
                            labelText: "ml-2 text-sm text-gray-700",
                            count: "ml-1 text-xs text-gray-500 font-normal",
                            showMore: "text-sm text-blue-600 hover:text-blue-800 mt-1"
                          }}
                        />
                      </div>
                      <TagsFilter />
                    </div>
                  </div>
                </div>
              )}

              {/* Results Column */}
              <div className={`${isSmallScreen ? 'col-span-12' : 'lg:col-span-9'}`}>
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-medium">Products</h2>
                    </div>
                    <div>
                      <label className="sr-only">Sort by</label>
                      <select
                        value={sortOption || ''}
                        onChange={(e) => setSortOption(e.target.value || null)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Featured</option>
                        <option value="min_price:asc">Price: Low to high</option>
                        <option value="min_price:desc">Price: High to low</option>
                        <option value="created_at:desc">Newest</option>
                      </select>
                    </div>
                  </div>
                  <Configure {...({
                    hitsPerPage: 12,
                    analytics: false,
                    enablePersonalization: false,
                    ...(sortOption ? { sort: [sortOption] } : {})
                  } as any)} />
                  <InfiniteHits className="mt-6" />
                </div>
              </div>
            </Index>
          ) : (
            // Categories tab
            <>
              {/* Filters Column - Desktop for categories */}
              {(!isSmallScreen || filterOpen) && (
                <div className={`${isSmallScreen ? 'mb-6' : 'lg:col-span-3'}`}>
                  <div className="sticky top-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <ClearRefinements translations={{ resetButtonText: 'Clear all' }} classNames={{ button: 'text-sm text-blue-600 hover:text-blue-800', disabledButton: 'text-sm text-gray-400' }} />
                      </div>
                      <Index indexName={CATEGORY_INDEX_NAME}>
                        <ParentCategoryFilter />
                        <CategoryFilters />
                      </Index>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Column for categories */}
              <div className={`${isSmallScreen ? 'col-span-12' : 'lg:col-span-9'}`}>
                <Index indexName={CATEGORY_INDEX_NAME}>
                  <div className="mb-4">
                    <h2 className="text-xl font-medium">Categories</h2>
                  </div>
                  <Configure hitsPerPage={20} analytics={false} enablePersonalization={false} />
                  <Hits 
                    hitComponent={({ hit }) => <CategoryHitComponent hit={hit as CategoryHit} />}
                    classNames={{
                      root: '',
                      list: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
                      item: ''
                    }}
                  />
                </Index>
              </div>
            </>
          )}
        </div>
      </InstantSearch>
    </div>
  )
}

export default ImprovedSearchPage

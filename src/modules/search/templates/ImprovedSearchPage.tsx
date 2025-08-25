"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
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
// import HorizontalFilterBar from "@modules/search/components/HorizontalFilterBar"

// Search input component that syncs with URL - Similar to navbar implementation
const SearchInputComponent = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { refine } = useSearchBox()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  
  // Sync with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("query") || ""
    setQuery(urlQuery)
    refine(urlQuery)
  }, [searchParams, refine])

  // Handle input changes - real-time search
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    refine(value)
    
    // Update URL in real-time for better UX
    const url = new URL(window.location.href)
    if (value.trim()) {
      url.searchParams.set('query', value.trim())
    } else {
      url.searchParams.delete('query')
    }
    // Use replace to avoid cluttering browser history
    window.history.replaceState({}, '', url.toString())
  }, [refine])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    // Input change already handles search, this is just for enter key
    if (query.trim()) {
      const url = new URL(window.location.href)
      url.searchParams.set('query', query.trim())
      router.replace(url.toString())
    }
  }, [query, router])

  // Handle clear button
  const handleClear = useCallback(() => {
    setQuery('')
    refine('')
    const url = new URL(window.location.href)
    url.searchParams.delete('query')
    window.history.replaceState({}, '', url.toString())
  }, [refine])

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        placeholder="Regale, Fachböden, Zubehör suchen..."
        className={`w-full ${
          isMobile 
            ? "py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-500 text-base"
            : "px-4 py-3 pl-12 pr-12 border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 text-gray-900 placeholder-gray-500"
        }`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="search"
        enterKeyHint="search"
      />
      
      {query && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Suche löschen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </form>
  )
}

// Product price filter component with enhanced animations
const PriceFilter = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-gray-200 py-6"
    >
      <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
      <RangeInput
        attribute="min_price"
        min={0}
        precision={0}
        classNames={{
          root: "space-y-4",
          form: "flex items-center space-x-2",
          input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors",
          submit: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors",
        }}
      />
    </motion.div>
  )
}

// Custom RefinementList component that conditionally shows "Show more" only when needed
const CustomRefinementList = ({ 
  attribute, 
  title, 
  limit = 10,
  showMoreLimit = 20,
  transformItems,
  classNames: customClassNames = {}
}: {
  attribute: string
  title: string
  limit?: number
  showMoreLimit?: number
  transformItems?: (items: any[]) => any[]
  classNames?: any
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-gray-200 py-6"
    >
      <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
      <RefinementList
        attribute={attribute}
        limit={limit}
        showMore={false}
        searchable={false}
        transformItems={transformItems}
        classNames={{
          root: "",
          list: "space-y-2",
          item: "flex items-center",
          label: "flex items-center cursor-pointer group",
          checkbox: "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2 transition-colors group-hover:border-green-400",
          labelText: "ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors",
          count: "ml-auto text-xs text-gray-500 font-normal bg-gray-100 px-2 py-1 rounded-full",
          showMore: "text-sm text-green-600 hover:text-green-800 mt-3 font-medium transition-colors",
          ...customClassNames
        }}
      />
    </motion.div>
  )
}

// Custom Dropdown RefinementList component for horizontal filters
const DropdownRefinementList = ({ 
  attribute, 
  limit = 10,
  showMoreLimit = 20,
  transformItems,
  classNames: customClassNames = {}
}: {
  attribute: string
  limit?: number
  showMoreLimit?: number
  transformItems?: (items: any[]) => any[]
  classNames?: any
}) => {
  return (
    <RefinementList
      attribute={attribute}
      limit={limit}
      showMore={false}
      searchable={false}
      transformItems={transformItems}
      classNames={{
        root: "",
        list: "space-y-2",
        item: "flex items-center",
        label: "flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors w-full",
        checkbox: "h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-800 focus:ring-2",
        labelText: "flex-1 truncate font-medium",
        count: "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full",
        showMore: "text-sm text-gray-600 hover:text-gray-900 mt-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors w-full text-center",
        ...customClassNames
      }}
    />
  )
}

// Product tags filter component
const TagsFilter = () => {
  return (
    <CustomRefinementList
      attribute="tag_ids"
      title="Tags"
      limit={8}
      showMoreLimit={15}
    />
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
          checkbox: "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2",
          labelText: "ml-2 text-sm text-gray-700",
          count: "ml-1 text-xs text-gray-500 font-normal",
          showMore: "text-sm text-green-600 hover:text-green-800 mt-1"
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
          checkbox: "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2",
          labelText: "ml-2 text-sm text-gray-700",
          count: "ml-1 text-xs text-gray-500 font-normal",
          showMore: "text-sm text-green-600 hover:text-green-800 mt-1"
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
        initialUiState={{
          [SEARCH_INDEX_NAME]: {
            query: query
          }
        }}
      >
        {/* clear Configure filters when no query to avoid MeiliSearch facet errors */}
        <Configure {...({ filters: query.trim() ? undefined : '' } as any)} />
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            {query ? `Suchergebnisse für "${query}"` : "Produktkatalog"}
          </h1>
          
          {/* Mobile Search Input */}
          <div className="md:hidden mb-4">
            <SearchInputComponent isMobile={true} />
          </div>
        </div>

        {/* Tab Navigation with clean industrial design */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex border-b border-gray-200 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`py-3 px-6 font-medium text-sm transition-all duration-200 ${
              activeTab === 'products' 
                ? 'border-b-2 border-gray-800 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Produkte
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`py-3 px-6 font-medium text-sm transition-all duration-200 ${
              activeTab === 'categories' 
                ? 'border-b-2 border-gray-800 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Kategorien
          </motion.button>
        </motion.div>

  {/* Mobile Filter Toggle with animation (only for categories view) */}
  {false && isSmallScreen && activeTab === 'categories' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <motion.svg 
                animate={{ rotate: filterOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </motion.svg>
              {filterOpen ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
          </motion.div>
        )}

        {/* Main Content Grid with animations */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:grid lg:grid-cols-12 lg:gap-8"
        >
          {activeTab === 'products' ? (
            <Index indexName={SEARCH_INDEX_NAME}>
              {/* Horizontal Filter Bar - Products Only */}
              <div className="lg:col-span-12 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 p-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {/* Filter Icon and Label */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 sm:mr-2">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                      </svg>
                      <span>Produktfilter</span>
                    </div>

                    {/* Horizontal Filters */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {/* Price Filter Dropdown */}
                      <div className="relative group">
                        <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium transition-all duration-200 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 min-h-[44px] touch-manipulation">
                          <span>Preis</span>
                          <svg className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <div className="absolute z-50 mt-2 w-80 sm:w-96 right-0 sm:left-0 rounded-xl border border-gray-200 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="p-4 sm:p-6">
                            <div className="mb-3 sm:mb-4 flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-900">Preisbereich</span>
                              <ClearRefinements
                                includedAttributes={["min_price"]}
                                translations={{ resetButtonText: "Zurücksetzen" }}
                                classNames={{ 
                                  button: "text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium",
                                  disabledButton: "text-xs text-gray-300"
                                }}
                              />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                              <RangeInput
                                attribute="min_price"
                                min={0}
                                precision={0}
                                classNames={{
                                  root: "space-y-3 sm:space-y-4",
                                  form: "space-y-3 sm:space-y-4",
                                  label: "text-xs sm:text-sm text-gray-700 font-medium flex justify-between items-center",
                                  input: "w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm font-medium bg-white",
                                  separator: "text-center text-gray-500 font-medium text-sm py-1",
                                  submit: "w-full px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors font-medium",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Categories Filter Dropdown */}
                      <div className="relative group">
                        <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium transition-all duration-200 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 min-h-[44px] touch-manipulation">
                          <span>Kategorien</span>
                          <svg className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <div className="absolute z-50 mt-2 w-72 sm:w-80 right-0 sm:left-0 rounded-xl border border-gray-200 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="p-3 sm:p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-900">Kategorien</span>
                              <ClearRefinements
                                includedAttributes={["category_ids"]}
                                translations={{ resetButtonText: "Zurücksetzen" }}
                                classNames={{ 
                                  button: "text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium",
                                  disabledButton: "text-xs text-gray-300"
                                }}
                              />
                            </div>
                            <div className="max-h-56 sm:max-h-64 overflow-y-auto">
                              <DropdownRefinementList
                                attribute="category_ids"
                                limit={10}
                                showMoreLimit={20}
                                transformItems={(items) => items.map((item: any) => ({
                                  ...item,
                                  label: categoryMap[item.value] || item.label || String(item.value)
                                })).sort((a: any, b: any) => (a.label || '').localeCompare(b.label || ''))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags Filter Dropdown */}
                      <div className="relative group">
                        <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium transition-all duration-200 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 min-h-[44px] touch-manipulation">
                          <span>Tags</span>
                          <svg className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <div className="absolute z-50 mt-2 w-72 sm:w-80 right-0 sm:left-0 rounded-xl border border-gray-200 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="p-3 sm:p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-900">Tags</span>
                              <ClearRefinements
                                includedAttributes={["tag_ids"]}
                                translations={{ resetButtonText: "Zurücksetzen" }}
                                classNames={{ 
                                  button: "text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium",
                                  disabledButton: "text-xs text-gray-300"
                                }}
                              />
                            </div>
                            <div className="max-h-56 sm:max-h-64 overflow-y-auto">
                              <DropdownRefinementList
                                attribute="tag_ids"
                                limit={8}
                                showMoreLimit={15}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clear All Button */}
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <ClearRefinements 
                        translations={{ resetButtonText: 'Alle Filter zurücksetzen' }}
                        classNames={{ 
                          button: 'w-full sm:w-auto text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-2 sm:py-1.5 rounded-lg hover:bg-gray-100 border border-gray-200 min-h-[44px] sm:min-h-0 touch-manipulation',
                          disabledButton: 'w-full sm:w-auto text-sm text-gray-400 px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Filters Column - Desktop (Hidden when using horizontal filters) */}
              {false && (!isSmallScreen || filterOpen) && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${isSmallScreen ? 'mb-6' : 'lg:col-span-3'}`}
                >
                  <div className="sticky top-4 space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <ClearRefinements 
                            translations={{ resetButtonText: 'Clear all' }}
                            classNames={{ 
                              button: 'text-sm text-green-600 hover:text-green-800 transition-colors', 
                              disabledButton: 'text-sm text-gray-400' 
                            }}
                          />
                        </motion.div>
                      </div>
                      <PriceFilter />
                      <CustomRefinementList
                        attribute="category_ids"
                        title="Categories"
                        limit={15}
                        showMoreLimit={30}
                        transformItems={(items) => items.map((item: any) => ({
                          ...item,
                          label: categoryMap[item.value] || item.label || String(item.value)
                        })).sort((a: any, b: any) => (a.label || '').localeCompare(b.label || ''))}
                      />
                      <TagsFilter />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Results Column */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="lg:col-span-12"
              >
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-medium">Products</h2>
                    </div>
                    <div>
                      <label className="sr-only">Sortierung</label>
                      <motion.select
                        whileHover={{ scale: 1.02 }}
                        value={sortOption || ''}
                        onChange={(e) => setSortOption(e.target.value || null)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm transition-colors"
                      >
                        <option value="">Empfohlen</option>
                        <option value="min_price:asc">Preis: Niedrig zu Hoch</option>
                        <option value="min_price:desc">Preis: Hoch zu Niedrig</option>
                        <option value="created_at:desc">Neueste</option>
                      </motion.select>
                    </div>
                  </div>
                  <Configure {...({
                    hitsPerPage: 12,
                    analytics: false,
                    enablePersonalization: false,
                    ...(sortOption ? { sort: [sortOption] } : {})
                  } as any)} />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <InfiniteHits className="mt-6" />
                  </motion.div>
                </div>
              </motion.div>
            </Index>
          ) : (
            // Categories tab
            <>
              {/* Results Column for categories */}
              <div className="lg:col-span-12">
                <Index indexName={CATEGORY_INDEX_NAME}>
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <h2 className="text-xl font-medium text-gray-900">Kategorien</h2>
                    <p className="text-sm text-gray-600 mt-1">Durchsuchen Sie unser Sortiment nach Kategorien</p>
                  </motion.div>
                  <Configure hitsPerPage={20} analytics={false} enablePersonalization={false} />
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Hits 
                      hitComponent={({ hit }) => <CategoryHitComponent hit={hit as CategoryHit} />}
                      classNames={{
                        root: '',
                        list: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
                        item: ''
                      }}
                    />
                  </motion.div>
                </Index>
              </div>
            </>
          )}
        </motion.div>
      </InstantSearch>
    </div>
  )
}

export default ImprovedSearchPage

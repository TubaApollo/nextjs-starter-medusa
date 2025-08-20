"use client"

import { searchClient, SEARCH_INDEX_NAME, CATEGORY_INDEX_NAME } from "@lib/search-client"
import { motion, AnimatePresence } from "framer-motion"
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState, useCallback } from "react"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import {
  RefinementList,
  SortBy,
  Stats,
  Configure,
  Index,
  useHits,
  useSearchBox,
  SearchBox,
  useInfiniteHits,
  useRefinementList,
} from "react-instantsearch"
import SearchPageProductHit from "@modules/search/components/SearchPageProductHit"
import CategoryHitComponent from "@modules/search/components/CategoryHit"
import InfiniteHits from "@modules/search/components/InfiniteHits"
import { CategoryHit, ProductHit } from "../../../../../types/search"
import { useSearchParams } from "next/navigation"

const SearchPageTemplate = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [sharedQuery, setSharedQuery] = useState("")
  const urlParams = useSearchParams()
  useEffect(() => {
    const q = urlParams.get('query') || ""
    setSharedQuery(q)
  }, [urlParams])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstantSearchNext 
        searchClient={searchClient} 
        indexName={SEARCH_INDEX_NAME} 
        routing={false}
        stalledSearchDelay={500}
      >
        <QueryFromUrl />
        <Configure hitsPerPage={12} />
        <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
          <Header onFiltersClick={() => setShowFilters(!showFilters)} onQueryChange={setSharedQuery} />
          <main className="flex gap-8">
            <FiltersSidebar show={showFilters} onClose={() => setShowFilters(false)} query={sharedQuery} />
            <Results sharedQuery={sharedQuery} />
          </main>
        </div>
      </InstantSearchNext>
    </div>
  )
}

// Sync URL query parameter to InstantSearch
function QueryFromUrl() {
  const params = useSearchParams()
  const { refine, query } = useSearchBox()
  
  useEffect(() => {
    const urlQuery = params.get('query')
    if (urlQuery && urlQuery !== query) {
      refine(urlQuery)
    }
  }, [params, refine, query])
  
  return null
}

function CustomSearchBox({ onQueryChange }: { onQueryChange: (q: string) => void }) {
  const { refine, query } = useSearchBox()
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    refine(val)
    onQueryChange(val)
  }, [refine, onQueryChange])

  return (
    <div className="mb-6 relative">
      <input
        value={query}
        onChange={onChange}
        placeholder="Search products and categories..."
        className="w-full py-3 pl-10 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 transition-all duration-200"
        aria-label="Search"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 p-0 text-gray-400">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </span>
      {query && (
        <button onClick={() => onChange({ target: { value: "" } } as any)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" aria-label="Clear">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  )
}

const Header = ({ onFiltersClick, onQueryChange }: { onFiltersClick: () => void; onQueryChange: (q: string) => void }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
    <CustomSearchBox onQueryChange={onQueryChange} />
    <div className="flex items-center justify-end mb-6">
      <button
        onClick={onFiltersClick}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FunnelIcon className="w-5 h-5" />
        Filters
      </button>
    </div>
  </div>
)

const FiltersSidebar = ({ show, onClose, query }: { show: boolean; onClose: () => void; query: string }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onClose} aria-label="Close filters" className="p-1 rounded hover:bg-gray-100">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-sm">Sort By</h4>
          <SortBy
            classNames={{
              root: "w-full",
              select: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm",
            }}
            items={[
              { value: SEARCH_INDEX_NAME, label: "Relevance" },
              { value: `${SEARCH_INDEX_NAME}:min_price:asc`, label: "Price: Low to High" },
              { value: `${SEARCH_INDEX_NAME}:min_price:desc`, label: "Price: High to Low" },
            ]}
          />
        </div>

        <CategoryPills query={query} />
      </motion.div>
    )}
  </AnimatePresence>
)

const Results = React.memo(({ sharedQuery }: { sharedQuery: string }) => {
  return (
    <div className="flex-1">
      {/* Categories Section - Separate instance to avoid inheriting product facets */}
      <CategoriesResultsSearch query={sharedQuery} />
      
      {/* Products Section - Main index */}
      <div className="mb-4">
        <Stats
          classNames={{
            root: "text-gray-600 text-sm",
          }}
          translations={{
            rootElementText: ({ nbHits }: { nbHits: number }) => `${nbHits} product results`,
          }}
        />
      </div>
      <ProductsSection />
    </div>
  )
})

const CategoriesSection = () => {
  const { hits } = useHits()
  const categoryHits = (hits as any[]).slice(0, 6)

  if (categoryHits.length === 0) return null

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Matching Categories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categoryHits.map((hit, index) => {
          const categoryHit: CategoryHit = {
            id: hit.objectID,
            name: hit.name || hit.title || 'Unnamed Category',
            handle: hit.handle,
            parent_category: hit.parent_category || null,
            thumbnail: hit.thumbnail ?? null,
            __position: hit.__position,
            __queryID: hit.__queryID,
            objectID: hit.objectID,
          }
          return (
            <CategoryHitComponent key={`${hit.objectID}-${index}`} hit={categoryHit} />
          )
        })}
      </div>
    </div>
  )
}

const ProductsSection = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
      <InfiniteHits className="[&>.grid]:grid-cols-2 md:[&>.grid]:grid-cols-4 xl:[&>.grid]:grid-cols-5" />
    </div>
  )
}

export default SearchPageTemplate

// Custom clickable pill filter for categories
function CategoryPills({ query }: { query: string }) {
  const { items, refine } = useRefinementList({ attribute: 'category_ids', limit: 50 })
  const selected = new Set(items.filter(i => i.isRefined).map(i => i.value))

  const clearAll = () => {
    items.filter(i => i.isRefined).forEach(i => refine(i.value))
  }

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-3 text-sm">Categories</h4>
      <div className="flex flex-wrap gap-2">
        <CategoryHitsSearch selected={selected} onToggle={(id: string) => refine(id)} query={query} />
      </div>
      {selected.size > 0 && (
        <button onClick={clearAll} className="mt-3 text-xs text-blue-600 hover:text-blue-700">Clear categories</button>
      )}
    </div>
  )
}

function CategoryPillsHitsInner({ selected, onToggle }: { selected: Set<string>; onToggle: (id: string) => void }) {
  const { hits } = useHits()
  const cats = (hits as any[]).slice(0, 30)
  if (cats.length === 0) return null
  return (
    <>
      {cats.map((hit, idx) => {
        const id = String(hit.id ?? hit.objectID)
        const active = selected.has(id)
        const label = hit.name || hit.title || `Category ${id}`
        return (
          <button
            key={`${id}-${idx}`}
            onClick={() => onToggle(id)}
            className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            aria-pressed={active}
          >
            {label}
          </button>
        )
      })}
    </>
  )
}

function CategoryHitsSearch({ selected, onToggle, query }: { selected: Set<string>; onToggle: (id: string) => void; query: string }) {
  return (
    <InstantSearchNext searchClient={searchClient} indexName={CATEGORY_INDEX_NAME} routing={false} stalledSearchDelay={500}>
      <Configure facets={[]} hitsPerPage={30} query={query} />
      <CategoryPillsHitsInner selected={selected} onToggle={onToggle} />
    </InstantSearchNext>
  )
}

function CategoriesResultsSearch({ query }: { query: string }) {
  return (
    <InstantSearchNext searchClient={searchClient} indexName={CATEGORY_INDEX_NAME} routing={false} stalledSearchDelay={500}>
      <Configure facets={[]} hitsPerPage={6} query={query} />
      <CategoriesSection />
    </InstantSearchNext>
  )
}

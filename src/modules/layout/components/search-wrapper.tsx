"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { useSearchBox, useHits, Index, Configure } from "react-instantsearch"
import { searchClient, SEARCH_INDEX_NAME, CATEGORY_INDEX_NAME } from "@lib/search-client"
import { usePathname, useRouter } from "next/navigation"
import ProductHitComponent from "@modules/search/components/ProductHit"
import CategoryHitComponent from "@modules/search/components/CategoryHit"
import { ProductHit, CategoryHit } from "../../../../types/search"

const SearchWrapper = () => {
  const [showDesktopResults, setShowDesktopResults] = useState(false)
  const [query, setQuery] = useState("")
  const [hasProductHits, setHasProductHits] = useState(false)
  const [hasCategoryHits, setHasCategoryHits] = useState(false)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const country = (pathname?.split('/')[1] || 'us')

  const handleFocus = useCallback(() => setShowDesktopResults(true), [])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // On mobile, tapping non-focusable elements may yield null relatedTarget.
    // Only close when focus actually moves to a node outside the wrapper.
    setTimeout(() => {
      const next = event.relatedTarget as Node | null
      if (!next) return
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(next)
      ) {
        setShowDesktopResults(false)
      }
    }, 100)
  }, [])

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (isMobile && showDesktopResults) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [showDesktopResults])

  // Listen for a global event to open the search overlay (used by nav icon)
  useEffect(() => {
    const openHandler = () => {
      setShowDesktopResults(true)
      // Focus appropriate input after render
      setTimeout(() => {
        try {
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            mobileInputRef.current?.focus()
          } else {
            desktopInputRef.current?.focus()
          }
        } catch {}
      }, 0)
    }
    window.addEventListener('open-search-overlay', openHandler)
    return () => window.removeEventListener('open-search-overlay', openHandler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/${country}/search?query=${encodeURIComponent(q)}`)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(event.target as Node)) {
        setShowDesktopResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-full flex justify-center">
      <InstantSearchNext searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
        <div className="relative inline-block w-full max-w-2xl" ref={inputWrapperRef}>
          <div className="hidden md:block">
            <SearchInput 
              query={query}
              setQuery={setQuery}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              inputRef={desktopInputRef}
            />
          </div>

          {/* Presence reporters (always mounted) */}
          <div className="hidden">
            <Index indexName={SEARCH_INDEX_NAME}>
              <PresenceReporter onChange={setHasProductHits} />
            </Index>
            <Index indexName={CATEGORY_INDEX_NAME}>
              <PresenceReporter onChange={setHasCategoryHits} />
            </Index>
          </div>

          {/* Desktop popup (md and up) */}
          <div className="hidden md:block">
            <AnimatePresence>
              {showDesktopResults && query.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full inset-x-0 -mx-5 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-thin"
                >
                  <div className={`grid ${hasProductHits && hasCategoryHits ? 'grid-cols-2 divide-x divide-gray-200' : 'grid-cols-1'}`}>
                    {/* Products Column */}
                    <AnimatePresence initial={false}>
                      {hasProductHits && (
                        <motion.div
                          key="products-col"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                          className="p-4"
                        >
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Products</h3>
                          <Index indexName={SEARCH_INDEX_NAME}>
                            <Configure hitsPerPage={20} />
                            <ProductResults query={query} country={country} max={10} />
                          </Index>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Categories Column */}
                    <AnimatePresence initial={false}>
                      {hasCategoryHits && (
                        <motion.div
                          key="categories-col"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.15 }}
                          className={`p-4 ${hasProductHits && hasCategoryHits ? '' : ''}`}
                        >
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                          <Index indexName={CATEGORY_INDEX_NAME}>
                            <Configure hitsPerPage={20} />
                            <CategoryResults query={query} country={country} max={10} />
                          </Index>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile full-screen overlay */}
          <div className="md:hidden">
            <AnimatePresence>
              {showDesktopResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-white flex flex-col"
                >
                  {/* Header with close and input */}
                  <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                    <button
                      type="button"
                      aria-label="Close search"
                      className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                      onClick={() => setShowDesktopResults(false)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex-1">
                      <SearchInput 
                        query={query}
                        setQuery={setQuery}
                        onFocus={() => {}}
                        onBlur={() => {}}
                        onSubmit={handleSubmit}
                        inputRef={mobileInputRef}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Show categories first, then products, stacked */}
                    <div className="p-4">
                      {hasCategoryHits && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                          <Index indexName={CATEGORY_INDEX_NAME}>
                            <Configure hitsPerPage={20} />
                            <CategoryResults query={query} country={country} max={10} />
                          </Index>
                        </div>
                      )}

                      {hasProductHits && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Products</h3>
                          <Index indexName={SEARCH_INDEX_NAME}>
                            <Configure hitsPerPage={20} />
                            <ProductResults query={query} country={country} max={10} />
                          </Index>
                        </div>
                      )}

                      {!hasCategoryHits && !hasProductHits && query.trim() && (
                        <div className="text-sm text-gray-500">No results</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </InstantSearchNext>
    </div>
  )
}

// Search Input Component
const SearchInput = ({ query, setQuery, onFocus, onBlur, onSubmit, inputRef }: {
  query: string
  setQuery: (q: string) => void
  onFocus: () => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  inputRef?: React.RefObject<HTMLInputElement>
}) => {
  const { refine } = useSearchBox()
  const localRef = useRef<HTMLInputElement>(null)
  const refToUse = inputRef ?? localRef

  useEffect(() => {
    const timer = setTimeout(() => {
      refine(query)
    }, 150)
    return () => clearTimeout(timer)
  }, [query, refine])

  const handleClear = () => {
    setQuery("")
    refine("")
    if (refToUse.current) {
      refToUse.current.focus()
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        ref={refToUse}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search products..."
        className="w-full py-3 pl-10 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 transition-all duration-200"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      
      {query && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Clear search"
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

// Product Results for Navigation Popup
const ProductResults = ({ query, country, max = 10 }: { query: string; country: string; max?: number }) => {
  const { hits, results } = useHits()
  const displayedHits = (hits as any[]).slice(0, max)
  const total = (results as any)?.nbHits ?? (hits as any[]).length
  const remaining = Math.max(0, total - displayedHits.length)

  if (displayedHits.length === 0) {
    return <div className="text-sm text-gray-500">No products found</div>
  }

  return (
    <div className="space-y-2">
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
        }
        return (
          <ProductHitComponent key={`${hit.objectID}-${index}`} hit={productHit} />
        )
      })}
      {remaining > 0 && (
        <a
          href={`/${country}/search?query=${encodeURIComponent(query)}`}
          className="block text-sm text-blue-600 hover:text-blue-700 mt-2"
        >
          and {remaining} other results →
        </a>
      )}
    </div>
  )
}

// Category Results for Navigation Popup
const CategoryResults = ({ query, country, max = 10 }: { query: string; country: string; max?: number }) => {
  const { hits, results } = useHits()
  const displayedHits = (hits as any[]).slice(0, max)
  const total = (results as any)?.nbHits ?? (hits as any[]).length
  const remaining = Math.max(0, total - displayedHits.length)

  if (displayedHits.length === 0) {
    return <div className="text-sm text-gray-500">No categories found</div>
  }

  return (
    <div className="space-y-2">
      {displayedHits.map((hit, index) => {
        const categoryHit: CategoryHit = {
          id: hit.objectID,
          name: hit.name,
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
      {remaining > 0 && (
        <a
          href={`/${country}/search?query=${encodeURIComponent(query)}`}
          className="block text-sm text-blue-600 hover:text-blue-700 mt-2"
        >
          and {remaining} other results →
        </a>
      )}
    </div>
  )
}

// Hidden component to report whether there are hits in the current Index to parent state
const PresenceReporter = ({ onChange }: { onChange: (hasHits: boolean) => void }) => {
  const { hits } = useHits()
  const has = (hits as any[]).length > 0
  useEffect(() => {
    onChange(has)
  }, [has, onChange])
  return null
}

export default SearchWrapper

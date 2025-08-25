"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InstantSearch } from "react-instantsearch"
import { useSearchBox, useHits, Index, Configure } from "react-instantsearch"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { searchClient, SEARCH_INDEX_NAME, CATEGORY_INDEX_NAME } from "@lib/search-client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import CompactProductHit from "@modules/search/components/CompactProductHit"
import CompactCategoryHit from "@modules/search/components/CompactCategoryHit"
import { ProductHit, CategoryHit } from "../../../../types/search"
import dynamic from "next/dynamic"

const SearchWrapperClient = () => {
  const [showDesktopResults, setShowDesktopResults] = useState(false)
  const [query, setQuery] = useState("")
  const [hasProductHits, setHasProductHits] = useState(false)
  const [hasCategoryHits, setHasCategoryHits] = useState(false)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const country = (pathname?.split('/')[1] || 'us')
  const isSearchPage = pathname?.includes('/search')

  // Handle focus events
  const handleFocus = useCallback(() => {
    if (isSearchPage) return // Don't show dropdown on search page
    setShowDesktopResults(true)
  }, [isSearchPage])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
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
    if (isMobile && showDesktopResults && !isSearchPage) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [showDesktopResults, isSearchPage])

  // Listen for a global event to open the search overlay (used by nav icon)
  useEffect(() => {
    const openHandler = () => {
      if (isSearchPage) return
      setShowDesktopResults(true)
      setTimeout(() => {
        try {
          if (window.innerWidth >= 768) {
            desktopInputRef.current?.focus()
          } else {
            mobileInputRef.current?.focus()
          }
        } catch (e) {
          // ignore
        }
      }, 100)
    }

    window.addEventListener("open-search", openHandler)
    return () => window.removeEventListener("open-search", openHandler)
  }, [isSearchPage])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    
    // Navigate to search page with query
    router.push(`/${country}/search?query=${encodeURIComponent(q)}`)
    setShowDesktopResults(false)
  }, [query, country, router])

  // Simple URL sync - only when NOT on search page
  useEffect(() => {
    if (isSearchPage) return
    
    const initial = searchParams?.get('query') || searchParams?.get('q') || ''
    setQuery(initial)
  }, [isSearchPage, searchParams])

  // Handle clicks outside to close the dropdown
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
      <div className="relative w-full max-w-md">
        {/* Desktop Search */}
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="w-full">
              <InstantSearchNext searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
                <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
                  <SearchInput 
                    query={query} 
                    setQuery={setQuery}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSubmit={handleSubmit}
                    inputRef={desktopInputRef}
                  />
                  
                  <AnimatePresence>
                    {showDesktopResults && !isSearchPage && (
                      <div className="relative w-full" ref={inputWrapperRef}>
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-2 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
                        >
                          <div className="p-4">
                            {/* Products */}
                            {hasProductHits && (
                              <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Products</h3>
                                <Configure hitsPerPage={5} />
                                <Hits 
                                  hitComponent={({ hit }) => (
                                    <CompactProductHit hit={hit as ProductHit} />
                                  )}
                                  classNames={{
                                    root: "space-y-2",
                                    list: "space-y-2",
                                    item: ""
                                  }}
                                />
                                <PresenceReporter onChange={setHasProductHits} />
                              </div>
                            )}
                            
                            {/* Categories */}
                            <Index indexName={CATEGORY_INDEX_NAME}>
                              {hasCategoryHits && (
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories</h3>
                                  <Configure hitsPerPage={3} />
                                  <Hits 
                                    hitComponent={({ hit }) => (
                                      <CompactCategoryHit hit={hit as CategoryHit} />
                                    )}
                                    classNames={{
                                      root: "space-y-2",
                                      list: "space-y-2",
                                      item: ""
                                    }}
                                  />
                                  <PresenceReporter onChange={setHasCategoryHits} />
                                </div>
                              )}
                            </Index>
                            
                            {!hasProductHits && !hasCategoryHits && query.trim() && (
                              <div className="text-center py-4 text-gray-500">
                                <p>No results found for "{query}"</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </InstantSearch>
              </InstantSearchNext>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden">
          <InstantSearchNext searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
            <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
              <SearchInput 
                query={query} 
                setQuery={setQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onSubmit={handleSubmit}
                inputRef={mobileInputRef}
              />
              
              <AnimatePresence>
                {showDesktopResults && !isSearchPage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-white overflow-y-auto"
                    style={{ top: '60px' }}
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <SearchInput 
                          query={query} 
                          setQuery={setQuery}
                          onFocus={() => {}}
                          onBlur={() => {}}
                          onSubmit={handleSubmit}
                          inputRef={mobileInputRef}
                        />
                      </div>
                      
                      {/* Products */}
                      {hasProductHits && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Products</h3>
                          <Configure hitsPerPage={10} />
                          <Hits 
                            hitComponent={({ hit }) => (
                              <CompactProductHit hit={hit as ProductHit} />
                            )}
                            classNames={{
                              root: "space-y-3",
                              list: "space-y-3",
                              item: ""
                            }}
                          />
                          <PresenceReporter onChange={setHasProductHits} />
                        </div>
                      )}
                      
                      {/* Categories */}
                      <Index indexName={CATEGORY_INDEX_NAME}>
                        {hasCategoryHits && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                            <Configure hitsPerPage={5} />
                            <Hits 
                              hitComponent={({ hit }) => (
                                <CompactCategoryHit hit={hit as CategoryHit} />
                              )}
                              classNames={{
                                root: "space-y-3",
                                list: "space-y-3",
                                item: ""
                              }}
                            />
                            <PresenceReporter onChange={setHasCategoryHits} />
                          </div>
                        )}
                      </Index>
                      
                      {!hasProductHits && !hasCategoryHits && query.trim() && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No results found for "{query}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </InstantSearch>
          </InstantSearchNext>
        </div>
      </div>
    </div>
  )
}

const SearchInput = ({ query, setQuery, onFocus, onBlur, onSubmit, inputRef }: {
  query: string
  setQuery: (query: string) => void
  onFocus: () => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  inputRef: React.RefObject<HTMLInputElement>
}) => {
  const handleClear = () => {
    setQuery('')
  }
  
  const refToUse = inputRef || useRef<HTMLInputElement>(null)

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
        placeholder="Produkte durchsuchen..."
        className="w-full py-3 pl-10 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 transition-all duration-200"
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
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
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

// Hidden component to report whether there are hits in the current Index to parent state
const PresenceReporter = ({ onChange }: { onChange: (hasHits: boolean) => void }) => {
  const { hits } = useHits()
  const has = (hits as any[]).length > 0
  useEffect(() => {
    onChange(has)
  }, [has, onChange])
  return null
}

// Export as dynamic component to avoid hydration issues
const SearchWrapper = dynamic(() => Promise.resolve(SearchWrapperClient), {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-md">
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="w-full">
              <form className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Produkte durchsuchen..."
                  className="w-full py-3 pl-10 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                  disabled
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default SearchWrapper

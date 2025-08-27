"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchBox, useHits, Index, Configure, Hits } from "react-instantsearch"
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

  // ...existing code...

  // Handle focus events
  const handleFocus = useCallback(() => {
    // Don't show dropdown on search page to avoid confusion
    if (isSearchPage) return
    setShowDesktopResults(true)
  }, [isSearchPage])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // Only blur on desktop - let mobile handle its own closing
    if (window.innerWidth < 768) return
    
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
  }, [])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    
    // Navigate to search page with query (or without query for browsing)
    if (q) {
      router.push(`/${country}/search?query=${encodeURIComponent(q)}`)
    } else {
      router.push(`/${country}/search`)
    }
    setShowDesktopResults(false)
  }, [query, country, router])

  // Handle "show more" clicks
  const handleShowMore = useCallback(() => {
    const q = query.trim()
    
    // Navigate to search page with query (or without query for browsing)
    if (q) {
      router.push(`/${country}/search?query=${encodeURIComponent(q)}`)
    } else {
      router.push(`/${country}/search`)
    }
    setShowDesktopResults(false)
  }, [query, country, router])

  // Simple URL sync - sync with search page URL
  useEffect(() => {
    const initial = searchParams?.get('query') || searchParams?.get('q') || ''
    if (initial !== query) {
      setQuery(initial)
    }
  }, [searchParams]) // Removed query from deps to prevent loops

  // Handle clicks outside to close the dropdown - Simple and reliable
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Only handle on desktop and when dropdown is visible
      if (typeof window === 'undefined' || window.innerWidth < 768 || !showDesktopResults) {
        return
      }
      
      const target = event.target as HTMLElement
      if (!target) return
      
      // Check if click is on search input
      const searchInput = desktopInputRef.current
      if (searchInput && (searchInput === target || searchInput.contains(target))) {
        return
      }
      
      // Check if click is inside the actual dropdown content box
      const dropdownContent = target.closest('.search-dropdown-content')
      if (dropdownContent) {
        return
      }
      
      // Any other click should close the dropdown
      setShowDesktopResults(false)
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDesktopResults) {
        setShowDesktopResults(false)
      }
    }

    // Add event listeners
    document.addEventListener("mousedown", handleDocumentClick)
    document.addEventListener("keydown", handleEscapeKey)
    
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [showDesktopResults])

  return (
    <div className="w-full flex justify-center search-wrapper-container">
      <div className="relative w-full max-w-md">
        {/* Desktop Search */}
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <InstantSearchNext searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
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
                    <div className="fixed inset-x-0 top-16 z-50 flex justify-center" ref={inputWrapperRef}>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-xl max-h-[32rem] overflow-hidden mt-2 search-dropdown-content"
                        style={{ width: '56rem', maxWidth: '90vw' }}
                      >
                        <div 
                          className="p-8 max-h-[32rem] overflow-y-auto search-dropdown-scroll"
                        >
                          <div className={`grid gap-12 ${hasProductHits && hasCategoryHits ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}> 
                            {/* Products Column */}
                            <div className={`${!hasProductHits ? 'hidden' : ''} ${hasProductHits && !hasCategoryHits ? 'lg:col-span-2' : ''}`}>
                              <h3 className="text-sm font-semibold text-gray-700 mb-3">Products</h3>
                              <Configure hitsPerPage={12} />
                              <CustomHits 
                                hitComponent={({ hit }) => (
                                  <CompactProductHit hit={hit as ProductHit} />
                                )}
                                classNames={{
                                  root: "space-y-2",
                                  list: "space-y-2",
                                  item: ""
                                }}
                                maxDisplay={5}
                                onShowMore={handleShowMore}
                              />
                              <PresenceReporter onChange={setHasProductHits} />
                            </div>
                            
                            {/* Categories Column */}
                            <Index indexName={CATEGORY_INDEX_NAME}>
                              <div className={`${!hasCategoryHits ? 'hidden' : ''} ${hasCategoryHits && !hasProductHits ? 'lg:col-span-2' : ''}`}>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
                                <Configure hitsPerPage={10} />
                                <CustomHits 
                                  hitComponent={({ hit }) => (
                                    <CompactCategoryHit hit={hit as CategoryHit} />
                                  )}
                                  classNames={{
                                    root: "space-y-2",
                                    list: "space-y-2",
                                    item: ""
                                  }}
                                  maxDisplay={5}
                                  onShowMore={handleShowMore}
                                />
                                <PresenceReporter onChange={setHasCategoryHits} />
                              </div>
                            </Index>
                          </div>
                          {!hasProductHits && !hasCategoryHits && query.trim() && (
                            <div className="text-center py-8 text-gray-500">
                              <p>No results found for "{query}"</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </InstantSearchNext>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden">
          <AnimatePresence>
            {showDesktopResults && (
              <InstantSearchNext searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-white overflow-y-auto search-dropdown-scroll"
                  style={{ top: '60px' }}
                >
                  <div className="p-4">
                    <div className="mb-4 flex items-center gap-3">
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
                      <button
                        onClick={() => setShowDesktopResults(false)}
                        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close search"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Products */}
                    <div className={`${!hasProductHits ? 'hidden' : ''} ${hasProductHits && !hasCategoryHits ? 'w-full' : 'mb-6'}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Products</h3>
                      <Configure hitsPerPage={20} />
                      <CustomHits 
                        hitComponent={({ hit }) => (
                          <CompactProductHit hit={hit as ProductHit} />
                        )}
                        classNames={{
                          root: "space-y-3",
                          list: "space-y-3",
                          item: ""
                        }}
                        maxDisplay={8}
                        onShowMore={handleShowMore}
                      />
                      <PresenceReporter onChange={setHasProductHits} />
                    </div>
                    
                    {/* Categories */}
                    <Index indexName={CATEGORY_INDEX_NAME}>
                      <div className={`${!hasCategoryHits ? 'hidden' : ''} ${hasCategoryHits && !hasProductHits ? 'w-full' : ''}`}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
                        <Configure hitsPerPage={15} />
                        <CustomHits 
                          hitComponent={({ hit }) => (
                            <CompactCategoryHit hit={hit as CategoryHit} />
                          )}
                          classNames={{
                            root: "space-y-3",
                            list: "space-y-3",
                            item: ""
                          }}
                          maxDisplay={6}
                          onShowMore={handleShowMore}
                        />
                        <PresenceReporter onChange={setHasCategoryHits} />
                      </div>
                    </Index>
                    {!hasProductHits && !hasCategoryHits && query.trim() && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No results found for "{query}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </InstantSearchNext>
            )}
          </AnimatePresence>
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
  const { refine } = useSearchBox()
  const router = useRouter()
  const pathname = usePathname()
  const isSearchPage = pathname?.includes('/search')
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    refine(value)
    
    // If on search page, update URL in real-time for better UX
    if (isSearchPage && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (value.trim()) {
        url.searchParams.set('query', value.trim())
      } else {
        url.searchParams.delete('query')
      }
      // Use replace to avoid cluttering browser history
      window.history.replaceState({}, '', url.toString())
    }
  }

  const handleClear = () => {
    setQuery('')
    refine('')
    
    // If on search page, also update URL to sync with the search page
    if (isSearchPage && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('query')
      window.history.replaceState({}, '', url.toString())
    }
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
        onChange={handleInputChange}
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
        data-search-input="true"
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

// Custom Hits component with "Show more" functionality
const CustomHits = ({ 
  hitComponent, 
  classNames, 
  maxDisplay = 5,
  onShowMore 
}: {
  hitComponent: (props: { hit: any }) => JSX.Element
  classNames?: any
  maxDisplay?: number
  onShowMore?: () => void
}) => {
  const { hits } = useHits()
  const displayHits = hits.slice(0, maxDisplay)
  const hasMore = hits.length > maxDisplay
  const remainingCount = hits.length - maxDisplay

  return (
    <div className={classNames?.root}>
      <div className={classNames?.list}>
        {displayHits.map((hit, index) => (
          <div key={hit.objectID || index} className={classNames?.item}>
            {hitComponent({ hit })}
          </div>
        ))}
      </div>
      {hasMore && onShowMore && (
        <button
          onClick={onShowMore}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Show {remainingCount} more result{remainingCount !== 1 ? 's' : ''}
        </button>
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

// Export as dynamic component to avoid hydration issues
const SearchWrapper = dynamic(() => Promise.resolve(SearchWrapperClient), {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-md">
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
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

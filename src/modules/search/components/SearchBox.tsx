"use client"

import { useRouter } from "next/navigation"
import { InstantSearch } from "react-instantsearch"
import { useSearchBox } from "react-instantsearch"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import SearchResults from "./SearchResults"
import SearchInputWithLoading from "./SearchInputWithLoading"
import { useSearchModal } from "@lib/context/search-modal-context"

const SearchBox = () => {
  const { searchOpen, setSearchOpen } = useSearchModal()
  const router = useRouter()

  // Handle ESC key to close mobile search
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [searchOpen, setSearchOpen])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const input = form.querySelector('input[type="search"]') as HTMLInputElement
    if (input.value) {
      router.push(`/search?query=${encodeURIComponent(input.value)}`)
      setSearchOpen(false)
    }
  }

  return (
    <div className="relative">
      {/* Desktop Search - handled by SearchWrapper */}

      {/* Mobile Search Pop-up */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[999] flex flex-col md:hidden"
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Search</h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <InstantSearch searchClient={searchClient as any} indexName={SEARCH_INDEX_NAME}>
                <div className="p-4">
                  <SearchInputWithLoading
                    onSubmit={handleSubmit}
                    placeholder="Search products..."
                    autoFocus
                  />
                </div>
                
                {/* Results container */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <SearchResults />
                </div>
              </InstantSearch>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultsWhenQuery({ children }: { children: React.ReactNode }) {
  const { query } = useSearchBox()
  const hasQuery = (query || '').trim().length > 0
  if (!hasQuery) return null
  return <>{children}</>
}

export default SearchBox
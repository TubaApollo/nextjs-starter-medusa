"use client"

import { useRouter } from "next/navigation"
import { InstantSearch } from "react-instantsearch"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import { useSearchBox } from "react-instantsearch"
import SearchResults from "./SearchResults"
import SearchHeader from "./SearchHeader"
import SearchInputWithLoading from "./SearchInputWithLoading"
import { useSearchModal } from "@lib/context/search-modal-context"

const MobileSearchPopup = () => {
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
      // Get current pathname to extract country code
      const currentPath = window.location.pathname
      const pathSegments = currentPath.split('/')
      const countryCode = pathSegments[1] || 'us' // Default to 'us' if no country code
      router.push(`/${countryCode}/search?query=${encodeURIComponent(input.value)}`)
      setSearchOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 bg-white z-[999] flex flex-col md:hidden"
        >
          <InstantSearch searchClient={searchClient as any} indexName={SEARCH_INDEX_NAME}>
            {/* Header with close button or loading indicator */}
            <SearchHeader />

            {/* Search content */}
            <div className="flex-1 flex flex-col overflow-hidden">
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
            </div>
          </InstantSearch>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileSearchPopup

function QueryGate({ children }: { children: React.ReactNode }) {
  const { query } = useSearchBox()
  const hasQuery = (query || '').trim().length > 0
  if (!hasQuery) return null
  return <>{children}</>
}

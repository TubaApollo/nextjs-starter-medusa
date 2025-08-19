"use client"

import { useRouter } from "next/navigation"
import { InstantSearch, SearchBox as AlgoliaSearchBox } from "react-instantsearch"
import { SearchClient } from "instantsearch.js"
import { AnimatePresence, motion } from "framer-motion"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import SearchResults from "./SearchResults"
import { useSearchModal } from "@lib/context/search-modal-context" // Add this import

const SearchBox = () => {
  const { searchOpen, setSearchOpen } = useSearchModal() // Use context
  const router = useRouter()

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
      {/* Desktop Search Box */}
      <div className="hidden md:block">
        <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
          <AlgoliaSearchBox
            onSubmit={handleSubmit}
            placeholder="Search products..."
            className="w-full p-2 border rounded"
            onFocus={() => setSearchOpen(true)}
          />
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50"
              >
                <SearchResults />
                <button
                  className="absolute top-2 right-2 text-gray-500"
                  onClick={() => setSearchOpen(false)}
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </InstantSearch>
      </div>

      {/* Mobile Search Pop-up */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[999] flex flex-col items-center p-6 md:p-8"
          >
            <div className="flex justify-end w-full max-w-md py-2 px-4">
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 text-3xl"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col w-full max-w-md pt-8 flex-grow overflow-y-auto">
              <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
                <AlgoliaSearchBox
                  onSubmit={handleSubmit}
                  placeholder="Search products..."
                  className="w-full py-3 px-4 border-2 border-gray-200 rounded-full text-lg mb-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                  autoFocus // Automatically focus the input when the pop-up opens
                />
                <SearchResults />
              </InstantSearch>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBox
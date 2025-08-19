"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { InstantSearch, SearchBox as AlgoliaSearchBox } from "react-instantsearch"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import SearchResults from "@modules/search/components/SearchResults"

const SearchWrapper = () => {
  const [showDesktopResults, setShowDesktopResults] = useState(false)
  const [hasResults, setHasResults] = useState(true)
  const inputWrapperRef = useRef<HTMLDivElement>(null)

  const handleFocus = useCallback(() => setShowDesktopResults(true), [])
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.relatedTarget as Node)
      ) {
        setShowDesktopResults(false)
      }
    }, 100)
  }, [])

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
      <InstantSearch searchClient={searchClient as any} indexName={SEARCH_INDEX_NAME}>
        <div className="relative inline-block w-full max-w-2xl" ref={inputWrapperRef}>
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <AlgoliaSearchBox
            placeholder="Search products..."
            classNames={{
              input:
                "w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
              submit: "hidden",
              reset: "hidden",
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <AnimatePresence>
            {showDesktopResults && hasResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full inset-x-0 -mx-5 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <SearchResults />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </InstantSearch>
    </div>
  )
}

export default SearchWrapper

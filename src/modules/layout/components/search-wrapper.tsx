"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ModalProvider } from "@lib/context/modal-context"
import SearchModal from "@modules/search/templates/search-modal"
import { FaSearch } from "react-icons/fa"
import { InstantSearch } from "react-instantsearch-hooks-web"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import SearchBox from "@modules/search/components/search-box"
import Hits from "@modules/search/components/hits"
import Hit from "@modules/search/components/hit"

const SearchWrapper = () => {
  const [showDesktopResults, setShowDesktopResults] = useState(false)
  const desktopSearchRef = useRef<HTMLDivElement>(null)

  const handleDesktopSearchFocus = useCallback(() => {
    setShowDesktopResults(true)
  }, [])

  const handleDesktopSearchBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding to allow click on results
    setTimeout(() => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.relatedTarget as Node)) {
        setShowDesktopResults(false)
      }
    }, 100)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setShowDesktopResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full lg:w-96" ref={desktopSearchRef}>
      <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
        <div className="relative flex items-center bg-white rounded-full shadow-lg focus-within:ring-2 focus-within:ring-ui-primary transition-all duration-200 ease-in-out hover:shadow-xl">
          <SearchBox
            onFocus={handleDesktopSearchFocus}
            onBlur={handleDesktopSearchBlur}
            className="w-full py-2 px-4 text-sm bg-transparent placeholder:text-ui-fg-base focus:outline-none"
            showMobileIcon={false}
          />
          {showDesktopResults && (
            <div className="absolute top-full left-0 w-full bg-white border border-ui-border-base shadow-lg rounded-md mt-2 z-50 max-h-96 overflow-y-auto transition-all duration-200 ease-in-out transform origin-top scale-y-100 opacity-100 max-w-lg">
              <Hits hitComponent={Hit} />
            </div>
          )}
        </div>
      </InstantSearch>
    </div>
  )
}

export default SearchWrapper

"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"

import Hit from "@modules/search/components/hit"
import Hits from "@modules/search/components/hits"
import SearchBox from "@modules/search/components/search-box"
import { XMarkMini } from "@medusajs/icons"
import { useEffect } from "react"

interface SearchModalProps {
  onClose: () => void
}

const SearchModal = ({ onClose }: SearchModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 transition-all duration-300 ease-in-out"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      data-testid="search-modal-container"
    >
      <div className="fixed inset-0 bg-opacity-75 backdrop-blur-md transition-opacity duration-300 ease-in-out bg-gray-500" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          className="flex min-h-full items-start justify-center text-center"
          onClick={onClose}
        >
          <div
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all duration-300 ease-in-out sm:w-full sm:max-w-lg w-full max-h-[80vh] overflow-y-auto px-4 pt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-ui-fg-subtle hover:text-ui-fg-base"
            >
              <XMarkMini />
            </button>
            <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
              <SearchBox showMobileIcon={false} />
              <Hits hitComponent={Hit} />
            </InstantSearch>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal

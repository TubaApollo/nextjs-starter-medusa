"use client"

import { useSearchModal } from "@lib/context/search-modal-context"
// Spinner removed to avoid flashing on mobile

const SearchHeader = () => {
  const { setSearchOpen } = useSearchModal()

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Search</h2>
      </div>
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
  )
}

export default SearchHeader


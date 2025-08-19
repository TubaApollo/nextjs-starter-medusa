"use client"

import { FaSearch } from "react-icons/fa"
import { useSearchModal } from "@lib/context/search-modal-context" // Add this import

export default function MobileSearchButton() {
  const { setSearchOpen } = useSearchModal() // Use context

  const handleSearchClick = () => {
    setSearchOpen(true) // Open the search modal
  }

  return (
    <>
      <div className="xl:hidden flex items-center">
        <button
          className="text-ui-fg-base hover:text-ui-fg-subtle"
          onClick={handleSearchClick}
        >
          <FaSearch size={18} aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

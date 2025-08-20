"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

export default function MobileSearchButton() {
  const handleSearchClick = () => {
    // Dispatch global event listened by SearchWrapper to open overlay
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-search-overlay'))
    }
  }

  return (
    <>
      <div className="xl:hidden flex items-center">
        <button
          className="text-ui-fg-base hover:text-ui-fg-subtle"
          onClick={handleSearchClick}
        >
          <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}

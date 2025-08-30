"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

const MobileSearchButton = () => {
  const handleClick = () => {
    console.log('Mobile search button clicked')
    // Trigger the search overlay via custom event
    window.dispatchEvent(new CustomEvent('open-search'))
  }

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={handleClick}
        className="flex items-center justify-center p-2 h-10 w-10 text-gray-600 hover:text-gray-900"
        aria-label="Open search"
      >
  <MagnifyingGlassIcon className="w-6 h-6" />
      </button>
    </div>
  )
}

export default MobileSearchButton

"use client"

import { useSearchBox } from "react-instantsearch-hooks-web"
import { FaSearch } from "react-icons/fa"

export default function SearchBox({ onFocus, onBlur, className, showMobileIcon = false }: { onFocus?: () => void; onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; className?: string; showMobileIcon?: boolean }) {
  const { query, refine } = useSearchBox()

  const handleOpen = () => {
    onFocus?.()
  }

  return (
    <>
      {showMobileIcon && (
        <button
          onClick={handleOpen}
          className="md:hidden flex items-center justify-center w-10 h-10 text-ui-fg-base"
          aria-label="Open search"
        >
          <FaSearch size={20} />
        </button>
      )}

      <div className={`flex items-center px-4 ${className}`}>
        <FaSearch size={18} className="text-ui-fg-base mr-2" /> {/* Added FaSearch icon */}
        <input
          type="search"
          placeholder="Search"
          className="bg-transparent h-8 w-full text-base-regular placeholder:text-ui-fg-base focus:outline-none"
          value={query}
          onChange={(e) => refine(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          data-testid="search-input"
        />
      </div>
    </>
  )
}

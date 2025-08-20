"use client"

import { useSearchBox, useInstantSearch } from "react-instantsearch"
import { useEffect, useRef, useState } from "react"

interface SearchInputWithLoadingProps {
  placeholder?: string
  autoFocus?: boolean
  onSubmit?: (event: React.FormEvent) => void
  debounceMs?: number
}

const SearchInputWithLoading = ({ 
  placeholder = "Search products...", 
  autoFocus = false,
  onSubmit,
  debounceMs = 150,
}: SearchInputWithLoadingProps) => {
  const { query, refine, clear } = useSearchBox()
  const { status } = useInstantSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const lastRefined = useRef<string>(query)
  const [value, setValue] = useState<string>(query)
  
  const isLoading = status === 'loading' || status === 'stalled'
  const hasQuery = query.length > 0

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Cleanup debounce timer on unmount or debounceMs change
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [debounceMs])

  // Keep local value in sync if query is changed externally (e.g., URL sync)
  useEffect(() => {
    // Only sync when external query differs from what we last refined from this input
    if (query !== lastRefined.current) {
      setValue(query)
    }
  }, [query])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (onSubmit) {
      onSubmit(event)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setValue(next) // update UI immediately
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      refine(next)
      lastRefined.current = next
    }, Math.max(0, debounceMs))
  }

  const handleClear = () => {
    setValue("")
    clear()
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full py-3 pl-10 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder-gray-400 transition-all duration-200"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      
      {/* Clear button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {hasQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchInputWithLoading

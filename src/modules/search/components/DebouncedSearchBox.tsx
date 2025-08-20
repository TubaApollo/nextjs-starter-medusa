"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useSearchBox } from "react-instantsearch"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface DebouncedSearchBoxProps {
  placeholder?: string
  debounceMs?: number
  className?: string
}

const DebouncedSearchBox = ({ 
  placeholder = "Search products...", 
  debounceMs = 100,
  className = ""
}: DebouncedSearchBoxProps) => {
  const { query, refine } = useSearchBox()
  const [inputValue, setInputValue] = useState(query)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Optimized debounce with immediate UI update
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (inputValue !== query) {
        refine(inputValue)
      }
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [inputValue, debounceMs, refine, query])

  // Update input when external query changes (but don't override user typing)
  useEffect(() => {
    if (query !== inputValue && document.activeElement?.tagName !== 'INPUT') {
      setInputValue(query)
    }
  }, [query, inputValue])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
  }, [])

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    refine(inputValue)
  }, [inputValue, refine])

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full py-4 pl-12 pr-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          autoComplete="off"
        />
      </div>
    </form>
  )
}

export default DebouncedSearchBox

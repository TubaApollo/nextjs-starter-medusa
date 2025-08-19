"use client"

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import { useSearchBox } from "react-instantsearch"

interface SearchInputProps {
  isSearching: boolean
  onFocus: () => void
}

const SearchInput = ({ isSearching, onFocus }: SearchInputProps) => {
  const { query, refine, clear } = useSearchBox()

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <MagnifyingGlassIcon className="absolute left-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => refine(e.target.value)}
          onFocus={onFocus}
          placeholder="Search products and categories..."
          className="w-full pl-12 pr-12 py-4 text-lg bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all duration-200"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clear}
              className="absolute right-4 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-12 top-1/2 -translate-y-1/2"
          >
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchInput
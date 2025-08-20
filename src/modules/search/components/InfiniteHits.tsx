"use client"

import React, { useEffect, useRef } from "react"
import { useInfiniteHits } from "react-instantsearch"
import SearchPageProductHit from "./SearchPageProductHit"

interface InfiniteHitsProps {
  className?: string
}

const InfiniteHits = ({ className = "" }: InfiniteHitsProps) => {
  const { hits, isLastPage, showMore } = useInfiniteHits()
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sentinelRef.current || isLastPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLastPage) {
          showMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [isLastPage, showMore])

  if (hits.length === 0) {
    return (
      <div className="flex-1 text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <div className={`flex-1 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {hits.map((hit, index) => {
          const key = `${hit.objectID ?? "noid"}-${(hit as any).__position ?? index}`
          return <SearchPageProductHit key={key} hit={hit as any} />
        })}
      </div>
      
      {!isLastPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span>Loading more products...</span>
          </div>
        </div>
      )}
      
      {isLastPage && hits.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the results</p>
        </div>
      )}
    </div>
  )
}

export default InfiniteHits

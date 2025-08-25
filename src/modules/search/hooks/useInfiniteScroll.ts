"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { useInfiniteHits, useSearchBox } from 'react-instantsearch'

/**
 * Custom hook for implementing infinite scrolling with InstantSearch
 * 
 * @returns {Object} Object containing:
 *   - hits: Array of all loaded hits
 *   - isLastPage: Boolean indicating if there are no more pages to load
 *   - showMore: Function to load the next page
 *   - isLoading: Boolean indicating if more items are being loaded
 *   - containerRef: Ref to attach to the container for intersection observer
 */
const useInfiniteScroll = () => {
  const { hits, results, showMore, isLastPage } = useInfiniteHits()
  const { query } = useSearchBox()
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevHitsLength = useRef(hits.length)

  // Detect when new hits are loaded
  useEffect(() => {
    if (hits.length > prevHitsLength.current) {
      setIsLoading(false)
    }
    prevHitsLength.current = hits.length
  }, [hits.length])

  // Function to trigger loading more results
  const loadMore = useCallback(() => {
    if (!isLastPage && !isLoading) {
      setIsLoading(true)
      showMore()
    }
  }, [isLastPage, isLoading, showMore])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLastPage && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.5 }
    )

    const currentContainer = containerRef.current
    observer.observe(currentContainer)

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer)
      }
    }
  }, [loadMore, isLastPage, isLoading, query])

  return {
    hits,
    isLastPage,
    showMore: loadMore,
    isLoading,
    containerRef,
    resultsState: results?._state,
  }
}

export default useInfiniteScroll

"use client"

import React, { useEffect, useRef } from "react"
import { useInfiniteHits } from "react-instantsearch"
import ProductHitComponent from "./ProductHit"
import { ProductHit } from "../../../../types/search"

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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 mb-3 md:mb-8">
        {hits.map((hit, index) => {
          const key = `${hit.objectID ?? "noid"}-${(hit as any).__position ?? index}`
          const productHit: ProductHit = {
            id: hit.objectID,
            objectID: hit.objectID,
            title: (hit as any).title || (hit as any).name || (hit as any).display_name || (hit as any).product_title || (hit as any).handle || "Unbenanntes Produkt",
            handle: (hit as any).handle,
            description: (hit as any).description ?? null,
            thumbnail: (hit as any).thumbnail ?? null,
            min_price: (hit as any).min_price ?? null,
            max_price: (hit as any).max_price ?? null,
            variant_sku: (hit as any).variant_sku ?? [],
            categories: (hit as any).categories ?? [],
            collection_title: (hit as any).collection_title ?? null,
            type: (hit as any).type ?? null,
            tags: (hit as any).tags ?? [],
            status: (hit as any).status ?? "published",
            created_at: (hit as any).created_at ?? "",
            updated_at: (hit as any).updated_at ?? "",
            variants: (hit as any).variants ?? [],
            __position: (hit as any).__position,
            __queryID: (hit as any).__queryID,
          }
          return <ProductHitComponent key={key} hit={productHit} />
        })}
      </div>
      
      {!isLastPage && (
        <div ref={sentinelRef} className="flex justify-center py-4 md:py-8">
          <div className="flex items-center space-x-2 text-gray-600 text-sm md:text-base">
            <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-gray-900"></div>
            <span className="hidden sm:inline">Loading more products...</span>
            <span className="sm:hidden">Loading…</span>
          </div>
        </div>
      )}
      
      {isLastPage && hits.length > 0 && (
        <div className="text-center py-4 md:py-8 text-gray-500 text-sm md:text-base">
          <p>End of results</p>
        </div>
      )}
    </div>
  )
}

export default InfiniteHits

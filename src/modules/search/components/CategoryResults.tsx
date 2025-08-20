"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import React, { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useHits, useSearchBox } from "react-instantsearch"

import { CategoryHit } from "../../../../types/search"
import CategoryHitComponent from "./CategoryHit"


const CategoryResults = () => {
  const { hits } = useHits()
  const pathname = usePathname()
  
  const hitsArray = Array.isArray(hits) ? hits : []
  const displayLimit = 10
  const hasMoreResults = hitsArray.length > displayLimit
  const displayedHits = hitsArray.slice(0, displayLimit)

    const { query } = useSearchBox()
  const effectiveQuery = query.trim()

  // No parent state updates here to avoid render loops; parent uses ResultsTracker

  if (hitsArray.length === 0) {
    return null
  }

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        className="grid grid-cols-1 gap-2"
      >
        {displayedHits.map((hit, index) => {
          const categoryHit: CategoryHit = {
            id: hit.objectID,
            name: hit.name,
            handle: hit.handle,
            parent_category: hit.parent_category || null,
            thumbnail: hit.thumbnail ?? null,
            __position: hit.__position,
            __queryID: hit.__queryID,
            objectID: hit.objectID,
          };
          return (
            <motion.div key={hit.objectID || `category-hit-${index}`} variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0 },
            }}>
                <CategoryHitComponent hit={categoryHit} />
            </motion.div>
          )
        })}
      </motion.div>
      
      {hasMoreResults && effectiveQuery && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href={`/${(pathname?.split('/')[1] || 'us')}/search?query=${encodeURIComponent(effectiveQuery)}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Show all {hitsArray.length} categories →
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryResults
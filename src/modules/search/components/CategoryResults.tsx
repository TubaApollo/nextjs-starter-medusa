"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import React from "react"
import { useHits } from "react-instantsearch"

import { CategoryHit } from "../../../../types/search"
import CategoryHitComponent from "./CategoryHit"

const CategoryResults = () => {
  const { hits } = useHits()

  if (hits.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No categories found.
      </p>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="grid grid-cols-1 gap-2"
    >
      {hits.map((hit, index) => {
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
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}>
              <CategoryHitComponent hit={categoryHit} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default CategoryResults
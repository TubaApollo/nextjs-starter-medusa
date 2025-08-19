"use client"

import { FolderIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Highlight } from "react-instantsearch"

import { CategoryHit } from "../../../../types/search"

interface CategoryHitProps {
  hit: CategoryHit
}

const CategoryHitComponent = ({ hit }: CategoryHitProps) => {
  console.log("Category Hit:", hit);
  return (
    <Link href={`/categories/${hit.handle}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
      >
        <div className="flex-shrink-0">
          {hit.thumbnail ? (
            <Image
              src={hit.thumbnail}
              alt={hit.name} // Use category name as alt text
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <FolderIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {hit.name || "N/A"}
          </h4>
          {hit.parent_category && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              in {hit.parent_category.name || "N/A"}
            </p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="flex-shrink-0 text-gray-400 dark:text-gray-500"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default CategoryHitComponent
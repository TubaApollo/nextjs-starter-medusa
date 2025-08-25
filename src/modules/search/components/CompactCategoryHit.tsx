"use client"

import React from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FolderIcon } from "@heroicons/react/24/outline"
import { CategoryHit } from "../../../../types/search"

interface CompactCategoryHitProps {
  hit: CategoryHit
}

export default function CompactCategoryHit({ hit }: CompactCategoryHitProps) {
  const categoryName = hit.name || "Unbenannte Kategorie"

  return (
    <LocalizedClientLink href={`/categories/${hit.handle}`}>
      <motion.div
        whileHover={{ backgroundColor: "#f9fafb" }}
        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
      >
        {/* Category Icon */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-100 flex items-center justify-center">
          <FolderIcon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
            {categoryName}
          </h4>
          <p className="text-xs text-gray-500 font-medium">
            Kategorie
          </p>
        </div>
      </motion.div>
    </LocalizedClientLink>
  )
}

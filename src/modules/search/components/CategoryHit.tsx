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
  // Enhanced hierarchy display with full path support
  console.log("CategoryHit DEBUG - Full hierarchy data:", {
    name: hit.name,
    hierarchy_path: hit.hierarchy_path,
    hierarchy_breadcrumb: hit.hierarchy_breadcrumb,
    level: hit.level,
  })
  
  // Build clean hierarchy breadcrumb display for industrial aesthetic
  const getCleanHierarchyBreadcrumb = () => {
    // Use the pre-built hierarchy_breadcrumb if available
    if (hit.hierarchy_breadcrumb && hit.hierarchy_breadcrumb !== hit.name) {
      // Split the breadcrumb and create clean, minimal components
      const pathParts = hit.hierarchy_breadcrumb.split(' → ');
      
      return pathParts.map((pathName, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-300 mx-2 text-sm">›</span>
          )}
          <span className={`${
            index === pathParts.length - 1 
              ? "font-medium text-gray-900" 
              : "text-gray-500 text-sm"
          }`}>
            {pathName}
          </span>
        </React.Fragment>
      ))
    }
    
    // Fallback to hierarchy_path array if available
    if (hit.hierarchy_path && hit.hierarchy_path.length > 1) {
      return hit.hierarchy_path.map((pathName, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-300 mx-2 text-sm">›</span>
          )}
          <span className={`${
            index === hit.hierarchy_path.length - 1 
              ? "font-medium text-gray-900" 
              : "text-gray-500 text-sm"
          }`}>
            {pathName}
          </span>
        </React.Fragment>
      ))
    }
    
    return null
  }

  const showHierarchy = hit.hierarchy_breadcrumb || (hit.hierarchy_path && hit.hierarchy_path.length > 1) || hit.parent_category?.name
  const isRootCategory = !showHierarchy
  
  return (
    <Link href={`/categories/${hit.handle}`} className="block">
      <motion.div
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1, y: -1 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      >
        {/* Clean Category Hierarchy Breadcrumb */}
        {showHierarchy && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-sm">
            <div className="flex items-center flex-wrap">
              {getCleanHierarchyBreadcrumb()}
            </div>
          </div>
        )}

        {/* Main Category Content */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Minimal Category Icon */}
            <div className="flex-shrink-0">
              {hit.thumbnail ? (
                <Image
                  src={hit.thumbnail}
                  alt={hit.name}
                  width={40}
                  height={40}
                  className="object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <FolderIcon className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Clean Category Info */}
            <div className="flex-1 min-w-0">
              {/* Category Name with Clean Typography */}
              <h4 className="font-medium text-gray-900 text-base mb-1 truncate group-hover:text-gray-700 transition-colors duration-200">
                <Highlight 
                  attribute="name" 
                  hit={hit}
                  classNames={{
                    root: "",
                    highlighted: "bg-gray-200 text-gray-900"
                  }}
                />
              </h4>
              
              {/* Minimal Level Indicator */}
              {hit.level !== undefined && hit.level > 0 && (
                <div className="text-xs text-gray-500 mb-1">
                  Ebene {hit.level + 1}
                </div>
              )}

              {/* Category Description */}
              {hit.description && (
                <p className="text-sm text-gray-600 line-clamp-1 leading-relaxed">
                  <Highlight 
                    attribute="description" 
                    hit={hit}
                    classNames={{
                      root: "",
                      highlighted: "bg-gray-200 text-gray-900"
                    }}
                  />
                </p>
              )}
            </div>

            {/* Simple Arrow */}
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default CategoryHitComponent
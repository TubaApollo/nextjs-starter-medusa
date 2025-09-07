"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import { fetchProductsByCategory } from "app/actions/product"
import { ChevronRightIcon, ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"

interface CategorySelectorProps {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
  region: HttpTypes.StoreRegion
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories: initialCategories,
  countryCode,
  region,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredCategoryPath, setHoveredCategoryPath] = useState<string[]>([])
  const [previewProduct, setPreviewProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileSubcategoryOverlay, setMobileSubcategoryOverlay] = useState<{
    categoryId: string
    level: number
    categories: HttpTypes.StoreProductCategory[]
    title: string
  } | null>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const topLevelCategories = useMemo(() => {
    return initialCategories?.filter((category) => !category.parent_category) || []
  }, [initialCategories])

  const categoryMap = useMemo(() => {
    const map = new Map<string, HttpTypes.StoreProductCategory>()
    initialCategories?.forEach((c) => map.set(c.id, c))
    return map
  }, [initialCategories])

  useEffect(() => {
    let isCancelled = false

    const fetchProduct = async () => {
      if (hoveredCategoryPath.length > 0 && isOpen && !isMobile) {
        const lastCategoryId = hoveredCategoryPath[hoveredCategoryPath.length - 1]
        setIsLoadingProduct(true)
        try {
          const products = await fetchProductsByCategory(lastCategoryId, region.id)
          if (!isCancelled) {
            setPreviewProduct(products.length > 0 ? products[0] : null)
          }
        } catch (error) {
          if (!isCancelled) {
            console.error("Failed to fetch product:", error)
            setPreviewProduct(null)
          }
        } finally {
          if (!isCancelled) {
            setIsLoadingProduct(false)
          }
        }
      } else {
        setPreviewProduct(null)
        setIsLoadingProduct(false)
      }
    }

    const timeoutId = setTimeout(fetchProduct, 200)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [hoveredCategoryPath, region.id, isOpen, isMobile])

  const handleCategoryHover = useCallback((categoryId: string, level: number) => {
    if (!isMobile) {
      // Desktop hover behavior
      setHoveredCategoryPath(prevPath => {
        const newPath = prevPath.slice(0, level)
        newPath.push(categoryId)
        return newPath
      })
    }
  }, [isMobile])

  const handleMobileCategoryClick = useCallback((category: HttpTypes.StoreProductCategory, level: number = 0) => {
    if (category.category_children && category.category_children.length > 0) {
      // Show overlay for subcategories
      setMobileSubcategoryOverlay({
        categoryId: category.id,
        level,
        categories: category.category_children,
        title: category.name
      })
    }
  }, [])

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev
      if (!newState) {
        // Reset states when closing
        setHoveredCategoryPath([])
        setMobileSubcategoryOverlay(null)
      }
      return newState
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsOpen(true)
    }
  }, [isMobile])

  const handleContainerMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsOpen(false)
      setHoveredCategoryPath([])
    }
  }, [isMobile])

  const closeMobileOverlay = useCallback(() => {
    setMobileSubcategoryOverlay(null)
  }, [])

  const renderDesktopSubcategories = useCallback((parentId: string, level: number) => {
    const parent = categoryMap.get(parentId)
    const children = parent?.category_children || []
    if (children.length === 0 && level > 0) return null
    const displayCategory = level === 0 ? categoryMap.get(hoveredCategoryPath[0]) : parent

    return (
      <motion.div
        key={parentId}
        className="w-64 p-4 border-r border-gray-200 bg-white flex-shrink-0 h-full"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -5 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      >
        <h3 className="text-md font-bold mb-3 text-gray-800">
          {displayCategory?.name}
        </h3>
        <ul>
          {(level === 0 ? displayCategory?.category_children : children)?.map((child) => {
            const fullChild = categoryMap.get(child.id)
            const hasChildren = fullChild?.category_children && fullChild.category_children.length > 0
            
            return (
              <li
                key={child.id}
                className="mb-1"
                onMouseEnter={() => {
                  handleCategoryHover(child.id, level + 1)
                }}
              >
                {hasChildren ? (
                  <button
                    className={`flex items-center justify-between text-sm text-gray-700 hover:text-red-600 transition-colors py-1 px-2 rounded w-full text-left ${
                      hoveredCategoryPath[level + 1] === child.id
                        ? "text-red-600 font-semibold bg-red-50"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleCategoryHover(child.id, level + 1)
                    }}
                    onMouseEnter={() => {
                      handleCategoryHover(child.id, level + 1)
                    }}
                  >
                    {child.name}
                    <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    href={`/${countryCode}/categories/${child.handle}`}
                    className={`flex items-center justify-between text-sm text-gray-700 hover:text-red-600 transition-colors py-1 px-2 rounded ${
                      hoveredCategoryPath[level + 1] === child.id
                        ? "text-red-600 font-semibold bg-red-50"
                        : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => {
                      handleCategoryHover(child.id, level + 1)
                    }}
                  >
                    {child.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </motion.div>
    )
  }, [categoryMap, hoveredCategoryPath, handleCategoryHover, countryCode])

  return (
    <div className="relative w-full flex justify-start">
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleContainerMouseLeave}
      >
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>Kategorien</span>
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {/* Extended hover zone - desktop only */}
        {!isMobile && (
          <div 
            className="absolute top-full left-0 w-full h-2 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
          />
        )}

        <AnimatePresence>
          {isOpen && (
            <>
              {isMobile ? (
                /* Mobile Layout - Full width dropdown */
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-4 right-4 mt-2 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-50"
                  style={{ 
                    minHeight: '300px',
                    maxHeight: '70vh'
                  }}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Kategorien</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                      {topLevelCategories.map((category) => (
                        <div key={category.id}>
                          {category.category_children && category.category_children.length > 0 ? (
                            <button
                              className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-red-600 transition-colors py-3 px-3 rounded-md hover:bg-gray-50 text-left"
                              onClick={() => handleMobileCategoryClick(category, 0)}
                            >
                              <span>{category.name}</span>
                              <ChevronRightIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <Link
                              href={`/${countryCode}/categories/${category.handle}`}
                              className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-red-600 transition-colors py-3 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{category.name}</span>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Desktop Layout - Expandable horizontal layout */
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    width: `${256 + (hoveredCategoryPath.length > 0 ? (hoveredCategoryPath.filter((categoryId, index) => {
                      const category = categoryMap.get(categoryId)
                      return category?.category_children && category.category_children.length > 0
                    }).length * 256) + 256 : 0)}px`
                  }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-50"
                  style={{ 
                    minWidth: '256px',
                    minHeight: '400px',
                    height: '400px'
                  }}
                  onMouseLeave={handleContainerMouseLeave}
                >
                <div className="flex h-[400px] overflow-hidden">
                  {/* Categories list */}
                  <div className="w-64 bg-gray-50 p-4 border-r border-gray-200 flex-shrink-0 h-full">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Kategorien</h3>
                    <ul className="space-y-1">
                      {topLevelCategories.map((category) => (
                        <li
                          key={category.id}
                          onMouseEnter={() => handleCategoryHover(category.id, 0)}
                        >
                          {category.category_children && category.category_children.length > 0 ? (
                            <button
                              className={`group flex items-center justify-between text-sm text-gray-700 hover:text-red-600 transition-colors py-2 px-3 rounded-md hover:bg-white w-full text-left ${
                                hoveredCategoryPath[0] === category.id ? "text-red-600 bg-white font-semibold" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault()
                                handleCategoryHover(category.id, 0)
                              }}
                            >
                              <span>{category.name}</span>
                              <ChevronRightIcon
                                className={`h-4 w-4 transition-all duration-200 ${hoveredCategoryPath[0] === category.id ? 'text-red-600' : ''}`}
                                aria-hidden="true"
                              />
                            </button>
                          ) : (
                            <Link
                              href={`/${countryCode}/categories/${category.handle}`}
                              className={`group flex items-center justify-between text-sm text-gray-700 hover:text-red-600 transition-colors py-2 px-3 rounded-md hover:bg-white ${
                                hoveredCategoryPath[0] === category.id ? "text-red-600 bg-white font-semibold" : ""
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{category.name}</span>
                              <ChevronRightIcon
                                className={`h-4 w-4 transition-all duration-200 ${hoveredCategoryPath[0] === category.id ? 'text-red-600' : ''}`}
                                aria-hidden="true"
                              />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dynamic Subcategories - desktop only */}
                  <div className="flex">
                    {hoveredCategoryPath.map((categoryId, index) => {
                      if (index === 0) {
                        return renderDesktopSubcategories(categoryId, index)
                      }
                      return null
                    })}
                  </div>
                  
                  {/* Product Preview - desktop only */}
                  <div className="hidden md:block w-64 p-4 border-l border-gray-200 bg-gray-50 flex-shrink-0 h-full">
                    <AnimatePresence mode="wait">
                      {isLoadingProduct ? (
                        <motion.div
                          key="loading"
                          className="h-full flex items-center justify-center text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600" />
                        </motion.div>
                      ) : previewProduct ? (
                        <motion.div
                          key={previewProduct.id}
                          className="h-full flex flex-col"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mb-2">
                            <span className="inline-block bg-red-600/10 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                              Top Produkt
                            </span>
                          </div>
                          <div className="relative w-full h-32 mb-3 rounded overflow-hidden">
                            <Image
                              src={previewProduct.thumbnail || "/path-to-category-image.jpg"}
                              alt={previewProduct.title || "Product image"}
                              fill
                              style={{ objectFit: "cover" }}
                              className="transition-transform duration-300 hover:scale-105"
                              sizes="200px"
                            />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                            {previewProduct.title}
                          </h4>
                          <p className="text-xs text-gray-600 flex-grow line-clamp-3 mb-3">
                            {previewProduct.description}
                          </p>
                          <Link
                            href={`/${countryCode}/products/${previewProduct.handle}`}
                            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded px-3 py-2 text-xs transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Details
                          </Link>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          className="h-full flex items-center justify-center text-gray-500 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div>
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <p className="text-xs">Wählen Sie eine Kategorie</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Mobile Subcategory Overlay */}
        <AnimatePresence>
          {isMobile && mobileSubcategoryOverlay && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-[60]"
                onClick={closeMobileOverlay}
              />
              
              {/* Overlay Panel */}
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-[70] overflow-y-auto"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{mobileSubcategoryOverlay.title}</h3>
                    <button
                      onClick={closeMobileOverlay}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {mobileSubcategoryOverlay.categories.map((subcategory) => (
                      <div key={subcategory.id}>
                        {subcategory.category_children && subcategory.category_children.length > 0 ? (
                          <button
                            className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-red-600 transition-colors py-3 px-3 rounded-md hover:bg-gray-50 text-left"
                            onClick={() => handleMobileCategoryClick(subcategory, mobileSubcategoryOverlay.level + 1)}
                          >
                            <span>{subcategory.name}</span>
                            <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <Link
                            href={`/${countryCode}/categories/${subcategory.handle}`}
                            className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-red-600 transition-colors py-3 px-3 rounded-md hover:bg-gray-50"
                            onClick={() => {
                              setIsOpen(false)
                              closeMobileOverlay()
                            }}
                          >
                            <span>{subcategory.name}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CategorySelector

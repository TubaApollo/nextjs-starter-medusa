"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { fetchProductsByCategory } from "app/actions/product" // Import the server action
import { ArrowRightIcon, ChevronRightIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import HeroSwiper from "./HeroSwiper"

interface HeroProps {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
  region: HttpTypes.StoreRegion
}

const slides = [
  {
    title: "Aller Anfang ist die Ordnung.",
    subtitle: "10% Rabatt auf alle Fachbodenregale",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto-format&fit=crop&w=2400&q=80",
  },
  {
    title: "Industrieregale für Profis",
    subtitle: "Stabilität und Qualität, die überzeugt.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto-format&fit=crop&w=2400&q=80",
  },
  {
    title: "Maßgeschneiderte Regalsysteme",
    subtitle: "Ihre Lagerlösung nach Maß.",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto-format&fit=crop&w=2400&q=80",
  },
]

const SLIDE_INTERVAL = 8000
const PRODUCT_FETCH_DELAY = 200



const Hero: React.FC<HeroProps> = ({
  categories: initialCategories,
  countryCode,
  region,
}) => {
  const [hoveredCategoryPath, setHoveredCategoryPath] = useState<string[]>([])
  const [previewProduct, setPreviewProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)

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
      if (hoveredCategoryPath.length > 0) {
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

    const timeoutId = setTimeout(fetchProduct, PRODUCT_FETCH_DELAY)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [hoveredCategoryPath, region.id])

  const handleCategoryHover = useCallback((categoryId: string, level: number) => {
    setHoveredCategoryPath(prevPath => {
      const newPath = prevPath.slice(0, level)
      newPath.push(categoryId)
      return newPath
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredCategoryPath([])
  }, [])

  const renderSubcategories = useCallback((parentId: string, level: number) => {
    const parent = categoryMap.get(parentId)
    const children = parent?.category_children || []
    if (children.length === 0 && level > 0) return null
    const displayCategory = level === 0 ? categoryMap.get(hoveredCategoryPath[0]) : parent

    return (
      <motion.div
        key={parentId}
        className="w-1/2 p-4 md:p-6"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
          {displayCategory?.name}
        </h3>
        <ul>
          {(level === 0 ? displayCategory?.category_children : children)?.map((child) => {
            const fullChild = categoryMap.get(child.id)
            return (
              <li
                key={child.id}
                className="mb-2"
                onMouseEnter={() => handleCategoryHover(child.id, level + 1)}
              >
                <Link
                  href={`/${countryCode}/categories/${child.handle}`}
                  className={`flex items-center justify-between text-sm md:text-md text-gray-700 hover:text-red-600 transition-colors ${
                    hoveredCategoryPath[level + 1] === child.id
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                >
                  {child.name}
                  {fullChild?.category_children && fullChild.category_children.length > 0 && (
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </motion.div>
    )
  }, [categoryMap, hoveredCategoryPath, handleCategoryHover, countryCode])

  return (
    <div
      className="relative w-full h-auto lg:h-[600px] flex flex-col lg:flex-row bg-gray-50"
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Sidebar - Desktop Only Navigation */}
      <div className="hidden lg:flex w-full lg:w-1/4 order-2 lg:order-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8 flex-col">
        <div className="flex flex-col flex-grow">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-white">Produkte</h2>
          <nav className="flex-grow" role="navigation" aria-label="Product categories">
            <ul className="space-y-1">
              {topLevelCategories.map((category) => (
                <motion.li
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category.id, 0)}
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Link
                    href={`/${countryCode}/categories/${category.handle}`}
                    className={`group flex items-center justify-between text-base lg:text-lg text-gray-300 hover:text-white transition-all duration-200 py-3 px-4 rounded-lg hover:bg-slate-700/50 ${
                      hoveredCategoryPath[0] === category.id ? "text-red-500 bg-slate-700/50" : ""
                    }`}
                    aria-label={`View ${category.name} category`}
                  >
                    <span>{category.name}</span>
                    <ChevronRightIcon
                      className={`h-4 w-4 transition-all duration-200 ${hoveredCategoryPath[0] === category.id ? 'text-red-500 translate-x-1' : 'group-hover:translate-x-1'}`}
                      aria-hidden="true"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Contact Information with Heroicons */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="space-y-4">
              <div className="group">
                <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Service-Hotline</h3>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-4 w-4 text-red-500" />
                  <p className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer text-sm">[Your Phone Number]</p>
                </div>
              </div>
              <div className="group">
                <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Service-E-Mail</h3>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-4 w-4 text-red-500" />
                  <p className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer text-sm">[Your Email Address]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Slider (Full width on mobile) */}
      <div className="w-full lg:w-3/4 order-1 lg:order-2 relative p-4 lg:p-6">
        <HeroSwiper />
        
        {/* Category Overlay Menu - Desktop Only */}
        <AnimatePresence>
          {hoveredCategoryPath.length > 0 && (
            <motion.div
              key="menu"
              className="absolute top-4 left-4 right-4 bottom-4 hidden lg:flex bg-white/95 backdrop-blur-xl z-20 rounded-lg shadow-2xl border border-gray-200/50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <div className="flex w-2/3 p-8 overflow-auto">
                {hoveredCategoryPath.map((categoryId, index) =>
                  renderSubcategories(categoryId, index)
                )}
              </div>

              {/* Product Preview Section */}
              <div className="w-1/3 p-8 border-l border-gray-200/30 bg-gradient-to-br from-gray-50/50 to-white/50">
                <AnimatePresence mode="wait">
                  {isLoadingProduct ? (
                    <motion.div
                      key="loading"
                      className="h-full flex items-center justify-center text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
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
                      <div className="mb-4">
                        <span className="inline-block bg-red-600/10 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider">
                          Top Produkt
                        </span>
                      </div>
                      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={previewProduct.thumbnail || "/path-to-category-image.jpg"}
                          alt={previewProduct.title || "Product image"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {previewProduct.title}
                      </h4>
                      <p className="text-sm text-gray-600 flex-grow line-clamp-3 mb-6">
                        {previewProduct.description}
                      </p>
                      <Link
                        href={`/${countryCode}/products/${previewProduct.handle}`}
                        className="group/product-cta inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white rounded-lg px-6 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105 md:px-8"
                        aria-label={`View details for ${previewProduct.title}`}
                      >
                        <span className="font-semibold">Details ansehen</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover/product-cta:translate-x-1" />
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
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-sm">Wählen Sie eine Kategorie, um ein Produkt anzuzeigen.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Hero
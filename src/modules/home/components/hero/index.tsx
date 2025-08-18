"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { fetchProductsByCategory } from "app/actions/product" // Import the server action

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

const SLIDE_INTERVAL = 5000
const PRODUCT_FETCH_DELAY = 200

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, SLIDE_INTERVAL)
    return () => clearInterval(slideInterval)
  }, [nextSlide])

  const handleDragEnd = useCallback(
    (_: unknown, { offset, velocity }: PanInfo) => {
  const swipeConfidenceThreshold = 10000
  const swipe = Math.abs(offset.x) * velocity.x

  if (swipe < -swipeConfidenceThreshold) {
    nextSlide()
  } else if (swipe > swipeConfidenceThreshold) {
    prevSlide()
  }
},
[nextSlide, prevSlide]

  )

  const slideVariants = {
    enter: { x: "100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  }

  return (
    <div className="relative w-full h-[300px] md:h-[450px] lg:h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.5,
          }}
          className="absolute w-full h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            style={{ objectFit: "cover", transform: "scale(1.02)" }}
            // MODIFICATION: Set priority to true for all slides to prevent lazy loading flash.
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-4 md:p-8 pointer-events-none">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-md md:text-xl text-white">
              {slides[currentSlide].subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators (bottom-right) */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-full backdrop-blur-sm">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="relative h-2 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="h-full w-full rounded-full bg-white/30" />
              {currentSlide === index && (
                <motion.div
                  layoutId="active-slide-indicator"
                  className="absolute inset-0 h-full w-full rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

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
                  href={`/categories/${child.handle}`}
                  className={`flex items-center justify-between text-sm md:text-md text-gray-700 hover:text-red-600 transition-colors ${
                    hoveredCategoryPath[level + 1] === child.id
                      ? "text-red-500 font-semibold"
                      : ""
                  }`}
                >
                  {child.name}
                  {fullChild?.category_children && fullChild.category_children.length > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </motion.div>
    )
  }, [categoryMap, hoveredCategoryPath, handleCategoryHover])

  return (
    <div
      className="relative w-full h-auto lg:h-[600px] flex flex-col lg:flex-row"
      onMouseLeave={handleMouseLeave}
    >
      {/* Left Sidebar - Categories */}
      <div className="w-full lg:w-1/4 order-2 lg:order-1 bg-[#1e2837] p-4 lg:p-8 flex flex-col font-sans">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-col flex-grow">
          <h2 className="text-3xl font-bold mb-6 text-white">Produkte</h2>
          <nav className="flex-grow" role="navigation" aria-label="Product categories">
            <ul>
              {topLevelCategories.map((category) => (
                <motion.li
                  key={category.id}
                  className="mb-4 relative"
                  onMouseEnter={() => handleCategoryHover(category.id, 0)}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={`/categories/${category.handle}`}
                    className={`flex items-center justify-between text-lg text-white hover:text-gray-300 transition-colors ${
                      hoveredCategoryPath[0] === category.id ? "text-red-500" : ""
                    }`}
                    aria-label={`View ${category.name} category`}
                  >
                    {category.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Contact Information */}
          <div className="mt-auto">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-white">Service-Hotline</h3>
              <p className="text-sm text-gray-300">[Your Phone Number]</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Service-E-Mail</h3>
              <p className="text-sm text-gray-300">[Your Email Address]</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <h2 className="text-xl font-bold text-white mb-4">Kategorien</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topLevelCategories.map((category) => (
              <Link
                href={`/categories/${category.handle}`}
                key={category.id}
                className="bg-gray-700/70 text-white p-4 rounded-lg text-center text-sm flex items-center justify-center hover:bg-gray-600/70 transition-colors"
                aria-label={`View ${category.name} category`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Hero Slider */}
      <div className="w-full lg:w-3/4 order-1 lg:order-2 relative">
        <HeroSlider />
        {/* Category Overlay Menu */}
        <AnimatePresence>
          {hoveredCategoryPath.length > 0 && (
            <motion.div
              key="menu"
              className="absolute top-0 left-0 w-full h-full hidden lg:flex bg-white z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex w-2/3 p-8 overflow-auto">
                {hoveredCategoryPath.map((categoryId, index) =>
                  renderSubcategories(categoryId, index)
                )}
              </div>

              {/* Product Preview Section */}
              <div className="w-1/3 p-8 border-l border-gray-200">
                <AnimatePresence mode="wait">
                  {isLoadingProduct ? (
                    <motion.div
                      key="loading"
                      className="h-full flex items-center justify-center text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </motion.div>
                  ) : previewProduct ? (
                    <motion.div
                      key={previewProduct.id}
                      className="h-full flex flex-col"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-bold mb-4 text-gray-800">Top Produkt</h3>
                      <div className="relative w-full h-48 mb-4">
                        <Image
                          src={previewProduct.thumbnail || "/path-to-category-image.jpg"}
                          alt={previewProduct.title || "Product image"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-lg"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {previewProduct.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2 flex-grow line-clamp-3">
                        {previewProduct.description}
                      </p>
                      <Link
                        href={`/products/${previewProduct.handle}`}
                        className="mt-4 inline-block text-white bg-red-600 hover:bg-red-700 rounded-full px-6 py-2 transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`View details for ${previewProduct.title}`}
                      >
                        Details ansehen
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      className="h-full flex items-center justify-center text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p>Wählen Sie eine Kategorie, um ein Produkt anzuzeigen.</p>
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
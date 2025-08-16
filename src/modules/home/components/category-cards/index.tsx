"use client"

import React from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  description: string
  productCount: number
}

const categories: Category[] = [
  { id: "1", name: "Bücherregale", description: "Stilvolle Aufbewahrung für Ihre Bücher", productCount: 15 },
  { id: "2", name: "Vitrinen", description: "Präsentieren Sie Ihre wertvollen Stücke", productCount: 10 },
  { id: "3", name: "Wandregale", description: "Maximieren Sie Ihren Wandraum", productCount: 20 },
  { id: "4", name: "Schwebende Regale", description: "Minimalistisch und modern", productCount: 8 },
  { id: "5", name: "Eckregale", description: "Perfekt für enge Räume", productCount: 12 },
  { id: "6", name: "Leiterregale", description: "Trendig und funktional", productCount: 6 },
  { id: "7", name: "Industrial Regale", description: "Robust und langlebig", productCount: 9 },
  { id: "8", name: "Modulare Regale", description: "An Ihre Bedürfnisse anpassbar", productCount: 14 },
]

// Simple SVG Icon
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const router = useRouter()

  return (
    <div
      className="group relative bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer h-full"
      onClick={() => router.push(`/categories/${category.id}`)}
    >
      <div className="p-8 h-full flex flex-col">
        {/* Header with count */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 border border-gray-300 group-hover:border-gray-500 transition-colors duration-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-300 group-hover:bg-gray-600 transition-colors duration-300"></div>
          </div>
          <span className="text-xs text-gray-400 font-light tracking-wider">
            {String(category.productCount).padStart(2, "0")}
          </span>
        </div>

        {/* Category Name */}
        <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide group-hover:text-black transition-colors duration-300">
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 font-light leading-relaxed flex-grow group-hover:text-gray-600 transition-colors duration-300">
          {category.description}
        </p>

        {/* Bottom section */}
        <div className="mt-8 flex items-center justify-between">
          <div className="w-6 h-px bg-gray-200 group-hover:bg-gray-400 transition-colors duration-300"></div>
          <div className="transform group-hover:translate-x-1 transition-transform duration-300">
            <ArrowIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

const CategoryGrid: React.FC = () => {
  if (categories.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-gray-400 font-light">Keine Kategorien verfügbar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-gray-300"></div>
          <h2 className="text-2xl font-light text-gray-900 tracking-wide">Kategorien</h2>
        </div>
        <p className="text-gray-500 font-light max-w-2xl">
          Entdecken Sie unsere sorgfältig kuratierten Kollektionen für jeden Stil und Raum.
        </p>
      </div>

      {/* Full-width connected grid with top border only */}
      <div className="pb-16 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {categories.map((category, idx) => (
            <div
              key={category.id}
              className={`border-gray-200 
                border-b 
                sm:border-r 
                ${(idx + 1) % 5 === 0 ? "sm:border-r-0" : ""}
              `}
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryGrid
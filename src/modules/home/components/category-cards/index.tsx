"use client"
import React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"

// Die Komponente akzeptiert weiterhin `categories` als Prop
interface CategoryGridProps {
  categories: HttpTypes.StoreProductCategory[]
}

// Pfeil-Icon
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
)

// Karten-Komponente mit verbessertem Design
const CategoryCard: React.FC<{ category: HttpTypes.StoreProductCategory }> = ({ category }) => {
  const router = useRouter()
  const thumbnailUrl = category.metadata?.thumbnail as string | undefined
  
  return (
    <div
      onClick={() => router.push(`/categories/${category.handle}`)}
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Hintergrundbild mit subtilem Zoom-Effekt */}
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
      
      {/* Gradient Overlay für bessere Lesbarkeit */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300"></div>
      
      {/* Inhalt */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 text-white">
        <div>
          <h3 className="mb-2 text-xl font-bold leading-tight lg:text-2xl">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="mb-4 text-sm text-gray-200 opacity-80 line-clamp-2 lg:text-base">
              {category.description}
            </p>
          )}
          
          {/* CTA - immer sichtbar */}
          <div className="flex items-center space-x-2 group/cta">
            <span className="text-sm font-medium">
              Jetzt entdecken
            </span>
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Grid-Komponente mit verbessertem Layout
const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold text-gray-900">Keine Kategorien verfügbar</h3>
          <p className="mt-2 text-gray-600">Schauen Sie später noch einmal vorbei.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Modern Section Divider */}
        <div className="mb-16 flex items-center justify-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-400"></div>
          <div className="px-8">
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Unsere Top-Kategorien
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-400"></div>
        </div>

        {/* Grid mit 4 quadratischen Spalten - volle Breite */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {categories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category.id}
              className="aspect-square w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
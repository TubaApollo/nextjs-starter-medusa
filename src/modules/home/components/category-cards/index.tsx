"use client"
import React from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

// Die Komponente akzeptiert weiterhin `categories` als Prop
interface CategoryGridProps {
  categories: HttpTypes.StoreProductCategory[]
}

// Using Heroicons instead of inline SVG for consistency

// Karten-Komponente mit verbessertem Design
const CategoryCard: React.FC<{ category: HttpTypes.StoreProductCategory }> = ({ category }) => {
  const router = useRouter()
  const params = useParams() as { countryCode?: string }
  const cc = (params?.countryCode || "") as string
  const thumbnailUrl = category.metadata?.thumbnail as string | undefined
  
  return (
    <div
      onClick={() => router.push(cc ? `/${cc}/categories/${category.handle}` : `/categories/${category.handle}`)}
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
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 text-white">
        <div>
          <h3 className="mb-2 text-lg sm:text-xl font-bold leading-tight lg:text-2xl">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-200 opacity-80 line-clamp-2 lg:text-base">
              {category.description}
            </p>
          )}
          
          {/* CTA - immer sichtbar */}
          <div className="flex items-center space-x-2 group/cta">
            <span className="text-xs sm:text-sm font-medium">
              Jetzt entdecken
            </span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
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
    <section className="w-full bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Modern Section Divider */}
        <div className="mb-10 sm:mb-14 md:mb-16 flex items-center justify-center">
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-400"></div>
          <div className="px-4 sm:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 lg:text-3xl leading-snug">
              Unsere Top-Kategorien
            </h2>
            {/* Mobile-only subtle divider */}
            <div className="mt-3 h-px w-16 mx-auto bg-gray-300/60 sm:hidden" />
          </div>
          <div className="hidden sm:block flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-400"></div>
        </div>

        {/* Grid mit 4 quadratischen Spalten - volle Breite */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
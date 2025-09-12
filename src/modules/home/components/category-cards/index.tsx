"use client"
import React from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { 
  WrenchScrewdriverIcon,
  CogIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  HomeIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon
} from "@heroicons/react/24/outline"

// Die Komponente akzeptiert weiterhin `categories` als Prop
interface CategoryGridProps {
  categories: HttpTypes.StoreProductCategory[]
}

// Icon mapping for different categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('hebe') || name.includes('verlegetechnik')) return WrenchScrewdriverIcon
  if (name.includes('bau') || name.includes('transport')) return TruckIcon
  if (name.includes('garten') || name.includes('landschaft')) return HomeIcon
  if (name.includes('bauheizer') || name.includes('lüfter')) return BoltIcon
  if (name.includes('diamant') || name.includes('bohr') || name.includes('schneid')) return CogIcon
  if (name.includes('mess')) return BeakerIcon
  if (name.includes('verdichtung')) return CogIcon
  if (name.includes('beleuchtung')) return BoltIcon
  if (name.includes('misch')) return BeakerIcon
  if (name.includes('absperr')) return WrenchScrewdriverIcon
  if (name.includes('werkstatt')) return CubeIcon
  if (name.includes('pumpen')) return CogIcon
  return BuildingStorefrontIcon
}

// Moderne Kategorie-Karte im Industrial Design - Horizontal Layout
const CategoryCard: React.FC<{ category: HttpTypes.StoreProductCategory }> = ({ category }) => {
  const router = useRouter()
  const params = useParams() as { countryCode?: string }
  const cc = (params?.countryCode || "") as string
  const thumbnailUrl = category.metadata?.thumbnail as string | undefined
  const IconComponent = getCategoryIcon(category.name)
  
  return (
    <div
      onClick={() => router.push(cc ? `/${cc}/categories/${category.handle}` : `/categories/${category.handle}`)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-300 hover:border-gray-300"
    >
      <div className="flex items-center space-x-4">
        {/* Image/Icon Container - Left Side */}
        <div className="flex-shrink-0">
          {thumbnailUrl ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={thumbnailUrl}
                alt={category.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-gray-600" />
            </div>
          )}
        </div>
        
        {/* Category Name - Right Side */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {category.name}
          </h3>
        </div>
      </div>
    </div>
  )
}

// Grid-Komponente mit Industrial Design
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
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="content-container">
        
        {/* Section Header - Left aligned with divider */}
        <div className="mb-4 small:mb-6">
          <div>
            <h2 className="txt-xlarge font-bold tracking-tight text-slate-900">
              UNSERE TOP KATEGORIEN
            </h2>
            <div className="mt-1 h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
          </div>
        </div>

  {/* Category Grid - responsive columns (as before), but limit to two rows worth of items */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((category, index) => (
            <div key={category.id}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
        {categories.length > 15 && (
          <ViewAllButton />
        )}
      </div>
    </section>
  )
}

// Separate component for the button to use hooks properly
const ViewAllButton: React.FC = () => {
  const router = useRouter()
  const params = useParams() as { countryCode?: string }
  const cc = (params?.countryCode || "") as string

  return (
    <div className="text-center mt-8">
      <button
        className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
        onClick={() => router.push(cc ? `/${cc}/categories` : `/categories`)}
      >
        Alle Kategorien anzeigen
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default CategoryGrid
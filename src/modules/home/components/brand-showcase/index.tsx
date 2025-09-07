import Image from "next/image"
import Link from "next/link"

// Placeholder brand data - will be replaced with backend data later
const placeholderBrands = [
  {
    id: "1",
    name: "Brand A",
    logo: "/media/brands/brand-a.png",
    slug: "brand-a"
  },
  {
    id: "2", 
    name: "Brand B",
    logo: "/media/brands/brand-b.png",
    slug: "brand-b"
  },
  {
    id: "3",
    name: "Brand C",
    logo: "/media/brands/brand-c.png", 
    slug: "brand-c"
  },
  {
    id: "4",
    name: "Brand D",
    logo: "/media/brands/brand-d.png",
    slug: "brand-d"
  },
  {
    id: "5",
    name: "Brand E",
    logo: "/media/brands/brand-e.png",
    slug: "brand-e"
  },
  {
    id: "6",
    name: "Brand F",
    logo: "/media/brands/brand-f.png",
    slug: "brand-f"
  },
  {
    id: "7",
    name: "Brand G",
    logo: "/media/brands/brand-g.png",
    slug: "brand-g"
  },
  {
    id: "8",
    name: "Brand H",
    logo: "/media/brands/brand-h.png",
    slug: "brand-h"
  },
  {
    id: "9",
    name: "Brand I",
    logo: "/media/brands/brand-i.png",
    slug: "brand-i"
  },
  {
    id: "10",
    name: "Brand J",
    logo: "/media/brands/brand-j.png",
    slug: "brand-j"
  },
  {
    id: "11",
    name: "Brand K",
    logo: "/media/brands/brand-k.png",
    slug: "brand-k"
  },
  {
    id: "12",
    name: "Brand L",
    logo: "/media/brands/brand-l.png",
    slug: "brand-l"
  }
]

export default function BrandShowcase() {
  return (
    <div className="content-container py-8 small:py-12">
      {/* Header */}
      <div className="mb-6 small:mb-8 flex items-center justify-between">
        <div>
          <h2 className="txt-xlarge font-bold tracking-tight text-slate-900">
            ALLE MARKEN
          </h2>
          <div className="mt-1 h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
        </div>
        
        {/* View All Arrow */}
        <Link 
          href="/brands" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          aria-label="Alle Hersteller anzeigen"
        >
          <span className="hidden sm:inline text-sm font-medium">Alle anzeigen</span>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 small:gap-6">
        {placeholderBrands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-[3/2] flex items-center justify-center">
              {/* Placeholder colored rectangles for now */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600 text-center px-2">
                  {brand.name}
                </span>
              </div>
              
              {/* When you have actual logos, replace the div above with: */}
              {/* <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
              /> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

import Image from "next/image"
import Link from "next/link"
import { listCollections } from "@lib/data/collections"

const PLACEHOLDER = "/media/brands/placeholder.svg"

async function getManufacturerCollections() {
  // Ensure metadata is requested from the API so we can read thumbnail/type
  const { collections } = await listCollections({ limit: "100", fields: "id,handle,title,metadata" })
  const manufacturers = collections.filter((c) => (c.metadata as any)?.type === "manufacturer")
  // Sort alphabetically by title/handle for stable presentation
  manufacturers.sort((a, b) => {
    const ta = (a.title || a.handle || "").toString().toLowerCase()
    const tb = (b.title || b.handle || "").toString().toLowerCase()
    return ta.localeCompare(tb)
  })
  return manufacturers
}

export default async function BrandShowcase() {
  const manufacturers = await getManufacturerCollections()

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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 small:gap-6">
        {manufacturers.map((col) => {
          const id = col.id
          const name = col.title || col.handle || `Hersteller ${id}`
          const thumb = (col.metadata as any)?.thumbnail as string | undefined
          const imageSrc = thumb || PLACEHOLDER

          return (
            <Link
              key={id}
              href={`/brands/${col.handle}`}
              className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-[3/2] flex items-center justify-center overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={`${name} logo`}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

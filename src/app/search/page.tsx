"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import FeaturedProducts from "@modules/home/components/featured-products"
import ImprovedSearchPage from "@modules/search/templates/ImprovedSearchPage"

const SearchPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [collections, setCollections] = useState<any[]>([])
  const [region, setRegion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const countryCode = searchParams.get("countryCode") || "us"
        const [regionData, collectionsData] = await Promise.all([
          getRegion(countryCode),
          listCollections({ fields: "id, handle, title" })
        ])
        setRegion(regionData)
        setCollections(collectionsData.collections || [])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [searchParams])

  return (
    <>
      {/* Main search experience with enhanced filtering */}
      <ImprovedSearchPage />

      {/* Fallback: Show featured products when no query and no search results */}
      {!query && !isLoading && (
        <div className="container mx-auto px-4 mt-12 mb-12">
          <h2 className="text-2xl font-semibold mb-8">Featured Collections</h2>
          {!isLoading && region && collections.length > 0 && (
            <FeaturedProducts collections={collections} region={region} />
          )}
        </div>
      )}
    </>
  )
}

export default SearchPage

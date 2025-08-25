"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { InstantSearch } from "react-instantsearch"
import { Configure, useSearchBox } from "react-instantsearch"

import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import SearchResults from "@modules/search/components/SearchResults"
import SearchInputWithLoading from "@modules/search/components/SearchInputWithLoading"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

// Component to watch search state and update URL
const UrlSync = ({ initialQuery }: { initialQuery: string }) => {
  const { query } = useSearchBox()
  const router = useRouter()

  useEffect(() => {
    if (query !== initialQuery) {
      const url = new URL(window.location.href)
      if (query.trim()) {
        url.searchParams.set("query", query)
      } else {
        url.searchParams.delete("query")
      }
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [query, initialQuery, router])

  return null
}

const SearchInputComponent = () => {
    const { refine } = useSearchBox();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get("query") || "";
        refine(query);
    }, [refine]);

    return (
        <SearchInputWithLoading
            placeholder="Search products..."
            autoFocus={false}
        />
    )
}

const ResultsPage = () => {
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
    <div className="container mx-auto px-4 py-8">
        <InstantSearch searchClient={searchClient} indexName={SEARCH_INDEX_NAME}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">
                {query ? `Search Results for "${query}"` : "All Products"}
                </h1>

                {/* Search Input */}
                <div className="max-w-2xl mb-6">
                    <SearchInputComponent />
                </div>
            </div>

            {/* Search Results */}
            <Configure
                hitsPerPage={20}
                analytics={false}
                enablePersonalization={false}
            />
            <UrlSync initialQuery={query} />
            <SearchResults />

            {/* Fallback: Show featured products when no query and no search results */}
            {!query && !isLoading && (
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-8">Featured Collections</h2>
                {!isLoading && region && collections.length > 0 && (
                <FeaturedProducts collections={collections} region={region} />
                )}
            </div>
            )}
        </InstantSearch>
    </div>
  )
}

export default ResultsPage

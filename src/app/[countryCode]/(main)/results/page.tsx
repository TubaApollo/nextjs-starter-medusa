"use client"

import { useSearchParams } from "next/navigation"
import SearchBox from "@modules/search/components/SearchBox" // New SearchBox

const ResultsPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Search Results for "{query}"</h1>
      {/* Render the new SearchBox component */}
      <SearchBox />
    </div>
  )
}

export default ResultsPage
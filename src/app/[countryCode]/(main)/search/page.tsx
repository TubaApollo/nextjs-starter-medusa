import { Suspense } from "react"
import SearchPageTemplate from "@modules/search/templates/search-page"

export const dynamic = "force-dynamic"

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading search...</div>}>
      <SearchPageTemplate />
    </Suspense>
  )
}

import { Metadata } from "next"

// import SearchResultsTemplate from "@modules/search/templates/search-results-template"

import { search } from "@modules/search/actions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Search",
  description: "Explore all of our products.",
}

type Params = {
  params: { query: string; countryCode: string }
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

export default async function SearchResults({ params, searchParams }: Params) {
  const { query } = params
  const { sortBy, page } = searchParams

  const hits = await search(query).then((data) => data)

  const ids = hits
    .map((h) => h.objectID || h.id)
    .filter((id): id is string => {
      return typeof id === "string"
    })

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      {ids.length > 0 ? (
        <ul>
          {ids.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  )
}

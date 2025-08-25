import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { SearchClient } from "instantsearch.js"

const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://127.0.0.1:7700"

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

// Create search client with proper configuration for empty queries
const ims = instantMeiliSearch(endpoint, apiKey, {
  placeholderSearch: true, // Enable search without query to show all results
  primaryKey: 'id',
  keepZeroFacets: true,
})

// Enhanced search client that properly handles empty queries
const enhancedSearchClient: SearchClient = {
  ...ims.searchClient,
  search(requests) {
    // Process requests to ensure empty queries work properly
    const processedRequests = requests.map(request => {
      const isEmptyQuery = !request.params?.query || request.params.query.trim() === ''
      
      return {
        ...request,
        params: {
          ...request.params,
          // For empty queries, ensure we still get results
          query: request.params?.query || '',
          hitsPerPage: request.params?.hitsPerPage || (isEmptyQuery ? 50 : 20),
          page: request.params?.page || 0,
          // Add any additional parameters needed for your MeiliSearch setup
        }
      }
    })

    return ims.searchClient.search(processedRequests)
  }
}

export const searchClient: SearchClient = enhancedSearchClient

// Index names from environment variables
export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_MEILISEARCH_PRODUCTS_INDEX ||
  process.env.NEXT_PUBLIC_INDEX_NAME ||
  "products"

export const CATEGORY_INDEX_NAME =
  process.env.NEXT_PUBLIC_MEILISEARCH_CATEGORIES_INDEX ||
  process.env.NEXT_PUBLIC_CATEGORY_INDEX_NAME ||
  "product_categories"
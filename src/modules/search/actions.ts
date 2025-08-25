"use server"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"

interface Hits {
  readonly objectID?: string
  id?: string
  [x: string | number | symbol]: unknown
}

/**
 * Uses MeiliSearch to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      return []
    }

    // MeiliSearch
    const queries = [{ params: { query: query.trim() }, indexName: SEARCH_INDEX_NAME }]
    const { results } = (await searchClient.search(queries)) as Record<
      string,
      any
    >
    
    if (!results || !Array.isArray(results) || results.length === 0) {
      return []
    }

    const { hits } = results[0] as { hits: Hits[] }
    return hits || []
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { SearchClient } from "instantsearch.js"

const endpoint =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://127.0.0.1:7700"

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

export const searchClient: SearchClient = {
  ...instantMeiliSearch(endpoint, apiKey).searchClient,
  search(requests) {
    return instantMeiliSearch(endpoint, apiKey).searchClient.search(requests)
  },
}

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"
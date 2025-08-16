"use client"

import { useHits } from "react-instantsearch-hooks-web"
import { ProductHit } from "@modules/search/components/hit"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import useDebounce from "@lib/hooks/use-debounce" // Import useDebounce

type HitsProps<THit> = React.ComponentProps<"div"> & {
  hitComponent: (props: { hit: THit; cheapestPrice?: any; loading?: boolean; error?: string | null }) => JSX.Element
}

const Hits = ({
  hitComponent: Hit,
  ...props
}: HitsProps<ProductHit>) => {
  const { hits } = useHits()
  const debouncedHits = useDebounce(hits, 300) // Debounce hits with a 300ms delay
  const { countryCode } = useParams()

  const [prices, setPrices] = useState<{ [key: string]: any }>({}) 
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [errorPrices, setErrorPrices] = useState<string | null>(null)

  const priceCache = useRef(new Map<string, { price: any; timestamp: number }>()).current;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    // Clear cache when debouncedHits changes significantly (e.g., new search)
    // A more sophisticated approach would be to invalidate only prices for products no longer in debouncedHits
    priceCache.clear(); // Simple cache clear for now

    const fetchAllPrices = async () => {
      setLoadingPrices(true)
      setErrorPrices(null)
      if (debouncedHits.length === 0) { // Use debouncedHits here
        setLoadingPrices(false)
        return
      }

      try {
        const pricePromises = debouncedHits.map(async (hit) => { // Use debouncedHits here
          const cachedEntry = priceCache.get(hit.id);
          if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
            return { id: hit.id, cheapestPrice: cachedEntry.price }; // Use cached price
          }

          const response = await fetch(`/api/products/${hit.id}/price?countryCode=${countryCode}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          priceCache.set(hit.id, { price: data.cheapestPrice, timestamp: Date.now() }); // Store in cache
          return { id: hit.id, cheapestPrice: data.cheapestPrice }
        })

        const fetchedPrices = await Promise.all(pricePromises)
        const newPrices: { [key: string]: any } = {}
        fetchedPrices.forEach(({ id, cheapestPrice }) => {
          newPrices[id] = cheapestPrice
        })
        setPrices(newPrices)
      } catch (error: any) {
        setErrorPrices(`Failed to fetch prices: ${error.message}`)
        console.error("Error fetching all prices:", error)
      } finally {
        setLoadingPrices(false)
      }
    }

    fetchAllPrices()
  }, [debouncedHits, countryCode]) // Use debouncedHits in dependency array

  return (
    <div
      className="p-4 flex flex-col gap-2"
      data-testid="search-results"
    >
      {hits.length > 0 ? (
        hits.map((hit, index) => (
          <li key={index} className="list-none">
            <Hit
              hit={hit as unknown as ProductHit}
              cheapestPrice={prices[hit.id]}
              loading={loadingPrices}
              error={errorPrices}
            />
          </li>
        ))
      ) : (
        <span data-testid="no-search-results-container">No results found.</span>
      )}
    </div>
  )
}

export default Hits

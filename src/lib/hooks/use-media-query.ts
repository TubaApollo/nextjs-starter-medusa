import { useState, useEffect } from "react"

/**
 * Custom hook for handling media queries
 * @param query The media query to check against
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Set initial value on client-side only
    if (typeof window !== "undefined") {
      setMatches(window.matchMedia(query).matches)
    }

    // Setup media query listener
    const mediaQueryList = window.matchMedia(query)
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener)
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(listener)
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener)
      } else {
        mediaQueryList.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

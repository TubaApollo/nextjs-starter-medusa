"use client"

import { useWishlist } from "@lib/context/wishlist-context"
import { Popover, PopoverContent, PopoverTrigger } from "@lib/components/ui/popover"
// framer-motion removed to avoid hydration mismatches on server/client
import WishlistDropdown from "../wishlist-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export default function WishlistNavIcon({ initialTotal }: { initialTotal?: number }) {
  const { totalItems } = useWishlist()
  const router = useRouter()

  // Show server-provided initial total until client context provides a value
  const [displayTotal, setDisplayTotal] = useState<number | undefined>(initialTotal)

  // sync client value when available
  useEffect(() => {
    if (typeof totalItems === "number") {
      setDisplayTotal(totalItems)
    }
  }, [totalItems])

  const [open, setOpen] = useState(false)
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handler = () => {
      setOpen(true)
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
      autoCloseTimer.current = setTimeout(() => setOpen(false), 5000)
    }
    window.addEventListener("open-wishlist-dropdown", handler)
    return () => window.removeEventListener("open-wishlist-dropdown", handler)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex items-center justify-center h-12 w-12 group">
          <button
            aria-label="Merkliste"
            data-testid="nav-wishlist-link"
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-accent transition-colors"
            onClick={() => router.push('/wishlist')}
            onMouseEnter={() => {
              setOpen(true)
              if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
            }}
            onMouseLeave={() => {
              if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
              autoCloseTimer.current = setTimeout(() => setOpen(false), 200)
            }}
          >
            <span className="sr-only">Merkliste</span>
            <div className="relative">
              {/* Simplified: render icon without framer-motion to avoid SSR hydration issues */}
              {totalItems > 0 ? (
                <HeartSolid className="w-6 h-6 text-red-600 transition-transform" />
              ) : (
                <HeartOutline className="w-6 h-6 text-ui-fg-subtle transition-transform" />
              )}

                {typeof displayTotal === "number" && displayTotal > 0 && (
                  <span className="absolute -top-1 -right-1 badge-count" aria-live="polite">{displayTotal}</span>
                )}
            </div>
          </button>
          {/* Dead zone below icon for hover forgiveness */}
          <div className="absolute left-0 right-0 -bottom-3 h-3 z-10" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="p-0 w-[420px] bg-white border shadow-lg hidden md:block backdrop-blur-sm"
        onMouseEnter={() => {
          if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
        }}
        onMouseLeave={() => {
          if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
          autoCloseTimer.current = setTimeout(() => setOpen(false), 200)
        }}
      >
        <WishlistDropdown />
      </PopoverContent>
    </Popover>
  )
}

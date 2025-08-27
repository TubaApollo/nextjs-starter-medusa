"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { Heart, Share2, Trash2, ShoppingBag, Copy, LogIn } from "lucide-react"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useWishlist } from "@lib/context/wishlist-context"
import { useCustomer } from "@lib/context/customer-context"
import { getShareToken } from "@lib/data/wishlist"

// Shadcn components
import { Button } from "@lib/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lib/components/ui/popover"
import { Badge } from "@lib/components/ui/badge"
import { Separator } from "@lib/components/ui/separator"
import { ScrollArea } from "@lib/components/ui/scroll-area"
import { Alert, AlertDescription } from "@lib/components/ui/alert"

interface WishlistDropdownProps {
  className?: string
}

const WishlistDropdown = ({ className }: WishlistDropdownProps) => {
  const [wishlistDropdownOpen, setWishlistDropdownOpen] = useState(false)
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | undefined>()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [authChangeInProgress, setAuthChangeInProgress] = useState(false)

  const { wishlist, removeItem, totalItems } = useWishlist()
  const { isAuthenticated } = useCustomer()
  const pathname = usePathname()
  const previousTotalItems = useRef(totalItems)
  const mounted = useRef(false)

  const openDropdown = () => setWishlistDropdownOpen(true)
  const closeDropdown = () => setWishlistDropdownOpen(false)

  // Opens dropdown and sets a timer to auto-close it after 5 seconds
  const openWithTimeout = () => {
    openDropdown()
    const timer = setTimeout(closeDropdown, 5000)
    setAutoCloseTimer(timer)
  }

  // Opens dropdown and clears any existing auto-close timer
  const openAndClearTimeout = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
    openDropdown()
  }

  // Cleanup timer on unmount or timer change
  useEffect(() => {
    return () => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer)
    }
  }, [autoCloseTimer])

  // Listen for auth changes to prevent auto-opening during login/logout
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthChangeInProgress(true)
      // Reset after a short delay to allow wishlist to load
      setTimeout(() => setAuthChangeInProgress(false), 1000)
    }

    window.addEventListener("auth-changed", handleAuthChange)
    window.addEventListener("auth-login", handleAuthChange)
    window.addEventListener("auth-logout", handleAuthChange)
    
    return () => {
      window.removeEventListener("auth-changed", handleAuthChange)
      window.removeEventListener("auth-login", handleAuthChange)
      window.removeEventListener("auth-logout", handleAuthChange)
    }
  }, [])

  // Automatically open dropdown when total items change (except on /wishlist page or during auth changes)
  useEffect(() => {
    if (mounted.current && !authChangeInProgress) {
      if (previousTotalItems.current !== totalItems && !pathname.includes("/wishlist")) {
        openWithTimeout()
      }
    } else {
      mounted.current = true
    }
    previousTotalItems.current = totalItems
  }, [totalItems, pathname, authChangeInProgress])

  // Open on global event (from WishlistButton)
  useEffect(() => {
    const handler = () => openWithTimeout()
    window.addEventListener("open-wishlist-dropdown", handler)
    return () => window.removeEventListener("open-wishlist-dropdown", handler)
  }, [])

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleShare = async () => {
    if (!wishlist?.items?.length) return
    
    setIsSharing(true)
    try {
      const token = await getShareToken()
      if (token) {
        const url = `${window.location.origin}/wishlist/${token.token}`
        setShareUrl(url)
        
        // Copy to clipboard
        await navigator.clipboard.writeText(url)
        
        // Show temporary success message
        setTimeout(() => setShareUrl(null), 3000)
      }
    } catch (error) {
      console.error("Failed to share wishlist:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className={`h-full ${className}`}>
      <Popover open={wishlistDropdownOpen} onOpenChange={setWishlistDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-full px-2"
            onMouseEnter={openAndClearTimeout}
            onMouseLeave={closeDropdown}
            aria-label="Merkliste"
          >
            <LocalizedClientLink
              href="/wishlist"
              data-testid="nav-wishlist-link"
              className="flex items-center relative"
              tabIndex={-1}
            >
              <Heart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                  aria-live="polite"
                >
                  {totalItems}
                </Badge>
              )}
            </LocalizedClientLink>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[420px] p-0 bg-white border shadow-lg hidden md:block backdrop-blur-sm"
          align="end"
          onMouseEnter={openAndClearTimeout}
          onMouseLeave={closeDropdown}
          data-testid="nav-wishlist-dropdown"
        >
          <div className="p-4 flex items-center justify-between border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Merkliste
            </h3>
            {wishlist?.items?.length ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                disabled={isSharing}
                className="gap-2 h-8"
                title="Merkliste teilen"
              >
                {isSharing ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Share2 className="h-3 w-3" />
                )}
                <span className="text-xs">Teilen</span>
              </Button>
            ) : null}
          </div>

          {shareUrl && (
            <div className="p-4 pb-2">
              <Alert className="bg-green-50 border-green-200">
                <Copy className="h-4 w-4" />
                <AlertDescription className="text-green-700">
                  Link kopiert! Merkliste wurde geteilt.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {wishlist && wishlist.items?.length ? (
            <>
              <ScrollArea className="max-h-[400px]">
                <div className="p-4 space-y-4">
                  {wishlist.items
                    .slice() // create a shallow copy before sorting
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    )
                    .map((item) => (
                      <div
                        className="flex gap-3 group"
                        key={item.id}
                        data-testid="wishlist-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_variant?.product?.handle || ''}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                            <Thumbnail
                              thumbnail={item.product_variant?.product?.thumbnail}
                              images={item.product_variant?.product?.images}
                              size="square"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </LocalizedClientLink>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1 mr-2">
                              <h4 className="text-sm font-medium truncate">
                                <LocalizedClientLink
                                  href={`/products/${item.product_variant?.product?.handle || ''}`}
                                  data-testid="product-link"
                                  className="hover:text-primary"
                                >
                                  {item.product_variant?.product?.title || 'Unbekanntes Produkt'}
                                </LocalizedClientLink>
                              </h4>
                              {item.product_variant?.title && item.product_variant.title !== 'Default Title' && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.product_variant.title}
                                </p>
                              )}
                              {item.product_variant?.sku && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {item.product_variant.sku}
                                </Badge>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                              aria-label="Von Merkliste entfernen"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Artikel gemerkt</span>
                  <Badge variant="secondary">{totalItems}</Badge>
                </div>

                <LocalizedClientLink href="/wishlist" className="block">
                  <Button
                    className="w-full gap-2"
                    onClick={closeDropdown}
                    data-testid="go-to-wishlist-button"
                  >
                    <Heart className="w-4 h-4" />
                    Zur Merkliste
                  </Button>
                </LocalizedClientLink>
              </div>
            </>
          ) : (
            <div className="flex py-16 flex-col gap-4 items-center justify-center text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                {isAuthenticated ? (
                  <Heart className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <LogIn className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <h4 className="font-medium">Ihre Merkliste ist leer</h4>
                    <p className="text-sm text-muted-foreground">
                      Speichern Sie Artikel für später
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium">Anmeldung erforderlich</h4>
                    <p className="text-sm text-muted-foreground">
                      Melden Sie sich an, um Ihre Merkliste zu verwalten
                    </p>
                  </>
                )}
              </div>

              {isAuthenticated ? (
                <LocalizedClientLink href="/store">
                  <Button onClick={closeDropdown} className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Produkte entdecken
                  </Button>
                </LocalizedClientLink>
              ) : (
                <LocalizedClientLink href="/account">
                  <Button onClick={closeDropdown} className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Jetzt anmelden
                  </Button>
                </LocalizedClientLink>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default WishlistDropdown

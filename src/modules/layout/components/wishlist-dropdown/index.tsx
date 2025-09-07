"use client"

import { Fragment, useRef, useState } from "react"
import { Heart, Share2, Trash2, ShoppingBag, Copy, LogIn, Loader2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import { useWishlist } from "@lib/context/wishlist-context"
import { useCustomer } from "@lib/context/customer-context"
import { getShareToken } from "@lib/data/wishlist"

// Shadcn components
import { Button } from "@lib/components/ui/button"
import { Badge } from "@lib/components/ui/badge"
import { Separator } from "@lib/components/ui/separator"
// using native overflow for reliable scroll in popovers
import { Alert, AlertDescription } from "@lib/components/ui/alert"

interface WishlistDropdownProps {
  className?: string
}

// Presentational dropdown content. Popover trigger and open-state
// are managed by the parent (wishlist-nav-icon).
const WishlistDropdown = ({ className }: WishlistDropdownProps) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const { wishlist, removeItem, totalItems } = useWishlist()
  const { isAuthenticated } = useCustomer()
  const pathname = usePathname()
  const params = useParams() as { countryCode?: string }
  const previousTotalItems = useRef(totalItems)

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleShare = async () => {
    if (!wishlist?.items?.length) return
    
    setIsSharing(true)
    try {
      const token = await getShareToken()
      if (token) {
  const prefix = params?.countryCode ? `/${params.countryCode}` : ""
  const url = `${window.location.origin}${prefix}/wishlist/${token.token}`
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
    <div className={`h-full ${className}`} data-testid="wishlist-dropdown-content">
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
              <Loader2 className="h-3 w-3 animate-spin" />
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
          <div className="overflow-y-auto max-h-[400px] search-dropdown-scroll scrollbar-thin">
            <div className="p-4 space-y-4">
              {wishlist.items
                .slice() // create a shallow copy before sorting
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item) => (
                  <div key={item.id} className="flex gap-3 group relative">
                    <LocalizedClientLink href={`/products/${item.product_variant?.product?.handle || ''}`} className="flex-shrink-0 w-24">
                      <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                        <Thumbnail
                          thumbnail={item.product_variant?.product?.thumbnail}
                          images={item.product_variant?.product?.images}
                          size="square"
                        />
                      </div>
                    </LocalizedClientLink>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1 mr-2">
                          <h4 className="text-sm font-medium truncate">
                            <LocalizedClientLink href={`/products/${item.product_variant?.product?.handle || ''}`} data-testid="product-link" className="hover:text-primary">
                              {item.product_variant?.product?.title || 'Unbekanntes Produkt'}
                            </LocalizedClientLink>
                          </h4>
                          <LineItemOptions variant={item.product_variant} data-testid="wishlist-item-variant" data-value={item.product_variant} />
                          <div className="text-xs text-muted-foreground mt-1">SKU: {item.product_variant?.sku || '—'}</div>
                        </div>

                        <div className="flex items-start justify-end">
                          {/* wishlist doesn't show a price here; keep space for alignment if needed */}
                        </div>
                      </div>

                      <div className="mt-2" />
                    </div>

                    <div className="absolute bottom-2 right-2 z-10">
                      <DeleteButton id={item.id} onClick={async (id: string) => await handleRemoveItem(id)} className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" data-testid="wishlist-item-remove-button" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-4 border-t space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Artikel gemerkt</span>
              {totalItems > 0 ? (
                <Badge variant="secondary">{totalItems}</Badge>
              ) : null}
            </div>

            <LocalizedClientLink href="/wishlist" className="block">
              <Button
                className="w-full"
                variant="outline"
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
              <Button className="w-full" variant="outline" size="default">
                <ShoppingBag className="w-4 h-4" />
                Produkte entdecken
              </Button>
            </LocalizedClientLink>
          ) : (
            <LocalizedClientLink href="/account">
              <Button className="w-full gap-2" variant="outline" size="default">
                <LogIn className="w-4 h-4" />
                Jetzt anmelden
              </Button>
            </LocalizedClientLink>
          )}
        </div>
      )}
    </div>
  )
}

export default WishlistDropdown

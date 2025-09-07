"use client"

import { useState } from "react"
import { Heart, Share2, Trash2, ShoppingBag, Copy, Check, LogIn } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useParams } from "next/navigation"
import { useWishlist } from "@lib/context/wishlist-context"
import { useCustomer } from "@lib/context/customer-context"
import { getShareToken } from "@lib/data/wishlist"
import { getPricesForVariant } from "@lib/util/get-product-price"
import PreviewPrice from "@modules/products/components/product-preview/price"
import ProductPreview from "@modules/products/components/product-preview"

// Shadcn components
import { Button } from "@lib/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Badge } from "@lib/components/ui/badge"
import { Separator } from "@lib/components/ui/separator"
import { Alert, AlertDescription } from "@lib/components/ui/alert"
import { Skeleton } from "@lib/components/ui/skeleton"
import { AspectRatio } from "@lib/components/ui/aspect-ratio"

export default function WishlistTemplate() {
  const { wishlist, removeItem, totalItems, isLoading } = useWishlist()
  const { isAuthenticated, isLoading: customerLoading } = useCustomer()
  const params = useParams() as { countryCode?: string }
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

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
        setCopySuccess(true)
        
        // Show temporary success message
        setTimeout(() => {
          setShareUrl(null)
          setCopySuccess(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Failed to share wishlist:", error)
    } finally {
      setIsSharing(false)
    }
  }

  // Wait for either wishlist or customer state to finish loading before deciding
  // whether to show the auth prompt. This prevents a brief "Anmelden" flash
  // when the page mounts and customer info is still being fetched.
  if (isLoading || customerLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32 mt-4 sm:mt-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated (only after customer loading finished)
  if (!isAuthenticated && !customerLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
  <Card className="border border-muted-foreground/25 max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Anmeldung erforderlich</CardTitle>
            <CardDescription className="mb-6 max-w-md">
              Sie müssen angemeldet sein, um Ihre Merkliste anzuzeigen und zu verwalten.
            </CardDescription>
            <LocalizedClientLink href="/account">
              <Button className="w-full gap-2" variant="outline">
                <LogIn className="h-4 w-4" />
                Jetzt anmelden
              </Button>
            </LocalizedClientLink>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="space-y-2 mb-4 sm:mb-0">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold tracking-tight">Meine Merkliste</h1>
          </div>
          <p className="text-muted-foreground">
            {totalItems === 0 
              ? "Ihre Merkliste ist leer" 
              : `${totalItems} ${totalItems === 1 ? 'Artikel' : 'Artikel'} gemerkt`
            }
          </p>
        </div>
        
        {wishlist?.items?.length ? (
          <div className="flex items-center gap-3">
            {shareUrl && (
              <Alert className="bg-green-50 border-green-200 text-green-700 px-4 py-2">
                <Check className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  {copySuccess ? "Link kopiert!" : "Freigabe-Link erstellt"}
                </AlertDescription>
              </Alert>
            )}
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
              className="gap-2"
            >
              {isSharing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              Merkliste teilen
            </Button>
          </div>
        ) : null}
      </div>

      {/* Wishlist Items Grid */}
      {wishlist && wishlist.items?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item) => {
            const variant = item.product_variant
            const product = variant?.product as any
            const priceInfo = variant ? getPricesForVariant(variant) : null

            return (
              <div
                key={item.id}
                className="group relative bg-white border border-ui-border-base rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <LocalizedClientLink href={`/products/${product?.handle || ''}`} className="block">
                  <div className="aspect-square p-4">
                    <Thumbnail
                      thumbnail={product?.thumbnail}
                      images={product?.images}
                      size="full"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-4 pt-0">
                    <h3 className="font-semibold mb-1 line-clamp-2">{product?.title || 'Unbekanntes Produkt'}</h3>

                    {variant?.title && variant.title !== 'Default Title' && (
                      <div className="text-sm text-muted-foreground mb-2">{variant.title}</div>
                    )}

                    {variant?.sku && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-600 font-mono bg-gray-50 px-1.5 py-0.5 rounded">SKU: {variant.sku}</span>
                      </div>
                    )}

                    {priceInfo && (
                      <div className="mb-2">
                        <PreviewPrice price={priceInfo} />
                        <span className="text-xs text-muted-foreground ml-1">pro St.</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Hinzugefügt am {new Date(item.created_at).toLocaleDateString('de-DE')}</div>
                    </div>
                  </div>
                </LocalizedClientLink>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Von Merkliste entfernen"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
  /* Empty State */
  <Card className="border border-muted-foreground/25 max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Ihre Merkliste ist leer</CardTitle>
            <CardDescription className="mb-6 max-w-md">
              Fügen Sie Produkte zu Ihrer Merkliste hinzu, um sie später anzusehen oder zu kaufen.
            </CardDescription>
            <LocalizedClientLink href="/store">
              <Button className="gap-2 w-full" variant="outline">
                <ShoppingBag className="h-4 w-4" />
                Produkte entdecken
              </Button>
            </LocalizedClientLink>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

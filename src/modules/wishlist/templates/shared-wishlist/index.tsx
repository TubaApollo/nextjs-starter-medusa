"use client"

import { Text, Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Wishlist } from "@lib/data/wishlist"
import { getPricesForVariant } from "@lib/util/get-product-price"
import PreviewPrice from "@modules/products/components/product-preview/price"

interface SharedWishlistTemplateProps {
  wishlist: Wishlist | null
  token: string
}

export default function SharedWishlistTemplate({ wishlist, token }: SharedWishlistTemplateProps) {
  const totalItems = wishlist?.items?.length ?? 0

  return (
    <div className="content-container py-6">
      <div className="flex flex-col gap-2 mb-6">
        <Text className="text-2xl font-semibold">Geteilte Merkliste</Text>
        <Text className="text-ui-fg-subtle">
          {totalItems === 0 
            ? "Diese Merkliste ist leer" 
            : `${totalItems} ${totalItems === 1 ? 'Artikel' : 'Artikel'} in dieser Merkliste`
          }
        </Text>
      </div>

      {wishlist && wishlist.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6">
          {wishlist.items.map((item) => {
            const variant = item.product_variant
            const product = variant?.product
            const priceInfo = variant ? getPricesForVariant(variant) : null
            
            return (
              <div
                key={item.id}
                className="group relative bg-white border border-ui-border-base rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product content */}
                <LocalizedClientLink
                  href={`/products/${product?.handle || ''}`}
                  className="block"
                >
                  <div className="aspect-square p-4">
                    <Thumbnail
                      thumbnail={product?.thumbnail}
                      images={product?.images}
                      size="full"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="p-4 pt-0">
                    <Text className="font-semibold mb-1 line-clamp-2">
                      {product?.title || 'Unbekanntes Produkt'}
                    </Text>
                    
                    {variant?.title && variant.title !== 'Default Title' && (
                      <Text className="text-sm text-ui-fg-subtle mb-2">
                        {variant.title}
                      </Text>
                    )}
                    
                    {variant?.sku && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-600 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                          SKU: {variant.sku}
                        </span>
                      </div>
                    )}
                    
                    {/* Price display */}
                    {priceInfo && (
                      <div className="mb-2">
                        <PreviewPrice price={priceInfo} />
                        <span className="text-xs text-ui-fg-subtle ml-1">pro St.</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Text className="text-sm text-ui-fg-subtle">
                        Hinzugefügt am {new Date(item.created_at).toLocaleDateString('de-DE')}
                      </Text>
                    </div>
                  </div>
                </LocalizedClientLink>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <Text className="text-xl font-semibold mb-2">Diese Merkliste ist leer</Text>
          <Text className="text-ui-fg-subtle mb-6 max-w-md">
            Die geteilte Merkliste enthält keine Produkte.
          </Text>
          <LocalizedClientLink href="/store">
            <Button>
              Produkte entdecken
            </Button>
          </LocalizedClientLink>
        </div>
      )}
    </div>
  )
}

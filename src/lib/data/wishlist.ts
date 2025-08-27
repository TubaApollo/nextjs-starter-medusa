"use server"

import { cache } from "react"
import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "./regions"
import { sdk } from "@lib/config"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const medusaHeaders = {
  "x-publishable-api-key": PUBLISHABLE_API_KEY!,
  "Content-Type": "application/json",
}

export interface WishlistItem {
  id: string
  product_variant_id: string
  wishlist_id: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  product_variant?: HttpTypes.StoreProductVariant & {
    id: string
    title: string
    sku?: string
    calculated_price?: {
      calculated_amount: number
      original_amount: number
      currency_code: string
      price_list_type?: string
    }
    product?: {
      id: string
      title?: string
      handle?: string
      thumbnail?: string
      description?: string
      images?: Array<{
        id: string
        url: string
        alt_text?: string
      }>
      variants?: HttpTypes.StoreProductVariant[]
    }
  }
}

export interface Wishlist {
  id: string
  customer_id: string
  items: WishlistItem[]
  created_at: string
  updated_at: string
}

export interface ShareToken {
  token: string
  expires_at: string
}

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_jwt")?.value

  return token
    ? {
        ...medusaHeaders,
        authorization: `Bearer ${token}`,
      }
    : medusaHeaders
}

export const retrieveWishlist = cache(async (): Promise<Wishlist | null> => {
  try {
    const headers = await getAuthHeaders()

    if (!('authorization' in headers)) {
      return null // User not authenticated
    }

    console.log('🔍 Retrieving wishlist...')

    // First, get the basic wishlist data without any complex fields
    const response = await fetch(`${BACKEND_URL}/store/customers/me/wishlists`, {
      method: "GET",
      headers,
      next: {
        tags: ["wishlist"],
        revalidate: 60,
      },
    })

    console.log('Wishlist retrieval response status:', response.status)

    if (!response.ok) {
      if (response.status === 401) {
        return null // User not authenticated
      }
      if (response.status === 404) {
        console.log('No wishlist found, will need to create one')
        return null // No wishlist exists yet
      }
      const errorText = await response.text()
      console.log('Error retrieving wishlist:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    console.log('📦 Basic wishlist data:', responseData)
    
    const wishlist = responseData.wishlist
    
    // If wishlist has items, enhance them with complete product data
    if (wishlist?.items?.length > 0) {
      console.log(`🔧 Enhancing ${wishlist.items.length} wishlist items with complete product data...`)
      
      // Get region for pricing
      const region = await getRegion("de")
      
      // Get unique product IDs from wishlist items
      const productIds = [...new Set(
        wishlist.items
          .map((item: any) => item.product_variant?.product_id || item.product_variant?.product?.id)
          .filter(Boolean)
      )]
      
      console.log('📋 Product IDs to fetch:', productIds)
      
      if (productIds.length > 0) {
        try {
          // Use SDK like the working product calls
          const productsData = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
            `/store/products`,
            {
              method: "GET",
              query: {
                id: productIds,
                region_id: region?.id,
                fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags"
              },
              headers,
              next: { revalidate: 3600 }
            }
          )
          
          console.log('✅ Fetched products using SDK:', productsData)
          
          // Create a map of products by ID for quick lookup
          const productMap = new Map()
          productsData.products?.forEach((product: any) => {
            productMap.set(product.id, product)
          })
          
          // Enhance wishlist items with complete product data
          wishlist.items = wishlist.items.map((item: any) => {
            const productId = item.product_variant?.product_id || item.product_variant?.product?.id
            const completeProduct = productMap.get(productId)
            
            if (completeProduct) {
              // Find the matching variant in the complete product
              const completeVariant = completeProduct.variants?.find((v: any) => 
                v.id === item.product_variant_id
              )
              
              if (completeVariant) {
                console.log(`✅ Enhanced item ${item.id} with complete data`)
                return {
                  ...item,
                  product_variant: {
                    ...item.product_variant,
                    ...completeVariant,
                    product: completeProduct
                  }
                }
              }
            }
            
            console.warn(`⚠️ Could not enhance item ${item.id}`)
            return item
          })
          
          console.log('🎉 Successfully enhanced all wishlist items')
        } catch (error) {
          console.error('❌ Error enhancing wishlist items:', error)
        }
      }
    }
    
    console.log('📋 Final wishlist structure (first item):', 
      wishlist?.items?.[0] ? {
        id: wishlist.items[0].id,
        hasVariant: !!wishlist.items[0].product_variant,
        hasProduct: !!wishlist.items[0].product_variant?.product,
        productTitle: wishlist.items[0].product_variant?.product?.title,
        hasCalculatedPrice: !!wishlist.items[0].product_variant?.calculated_price
      } : 'No items'
    )
    
    return wishlist
  } catch (error) {
    console.error("Failed to fetch wishlist:", error)
    return null
  }
})

export async function createWishlist(): Promise<Wishlist | null> {
  try {
    const headers = await getAuthHeaders()

    if (!('authorization' in headers)) {
      throw new Error("Authentication required")
    }

    console.log('Creating wishlist...')

    const response = await fetch(`${BACKEND_URL}/store/customers/me/wishlists`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    })

    console.log('Create wishlist response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error creating wishlist:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Create wishlist success:', responseData)
    
    const { wishlist } = responseData
    revalidateTag("wishlist")
    return wishlist
  } catch (error) {
    console.error("Failed to create wishlist:", error)
    return null
  }
}

export async function addWishlistItem(variantId: string): Promise<{ item: WishlistItem | null, wishlist: Wishlist | null }> {
  try {
    const headers = await getAuthHeaders()

    if (!('authorization' in headers)) {
      throw new Error("Authentication required")
    }

    console.log('Adding wishlist item with variantId:', variantId)

    const response = await fetch(`${BACKEND_URL}/store/customers/me/wishlists/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        variant_id: variantId,
      }),
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response body:', errorText)
      
      // Handle the case where variant is already in wishlist
      if (response.status === 400 && errorText.includes("already in wishlist")) {
        console.log('Variant is already in wishlist, fetching current wishlist')
        const currentWishlist = await retrieveWishlist()
        return { item: null, wishlist: currentWishlist }
      }
      
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Success response:', responseData)
    
    // Revalidate and fetch the updated wishlist to ensure we have complete data
    revalidateTag("wishlist")
    const updatedWishlist = await retrieveWishlist()
    
    return { item: null, wishlist: updatedWishlist }
  } catch (error) {
    console.error("Failed to add wishlist item:", error)
    return { item: null, wishlist: null }
  }
}

export async function removeWishlistItem(itemId: string): Promise<boolean> {
  try {
    const headers = await getAuthHeaders()

    if (!('authorization' in headers)) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`${BACKEND_URL}/store/customers/me/wishlists/items/${itemId}`, {
      method: "DELETE",
      headers,
    })

    const success = response.ok
    if (success) {
      revalidateTag("wishlist")
    }
    return success
  } catch (error) {
    console.error("Failed to remove wishlist item:", error)
    return false
  }
}

export async function getShareToken(): Promise<ShareToken | null> {
  try {
    const headers = await getAuthHeaders()

    if (!('authorization' in headers)) {
      throw new Error("Authentication required")
    }

    console.log('Generating share token for wishlist')

    const response = await fetch(`${BACKEND_URL}/store/customers/me/wishlists/share`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    })

    console.log('Share token response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error generating share token:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Share token success:', responseData)
    
    return {
      token: responseData.token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    }
  } catch (error) {
    console.error("Failed to get share token:", error)
    return null
  }
}

export async function retrieveSharedWishlist(token: string): Promise<Wishlist | null> {
  try {
    console.log('Retrieving shared wishlist with token:', token)

    const response = await fetch(`${BACKEND_URL}/store/wishlists/${token}`, {
      method: "GET", 
      headers: medusaHeaders,
      next: {
        tags: ["shared-wishlist"],
        revalidate: 300,
      },
    })

    console.log('Shared wishlist response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error retrieving shared wishlist:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('✅ Shared wishlist success:', responseData)
    
    // Apply the same enhancement logic for shared wishlists
    const wishlist = responseData.wishlist
    
    if (wishlist?.items?.length > 0) {
      console.log(`🔧 Enhancing ${wishlist.items.length} shared wishlist items...`)
      
      const region = await getRegion("de")
      const productIds = [...new Set(
        wishlist.items
          .map((item: any) => item.product_variant?.product_id || item.product_variant?.product?.id)
          .filter(Boolean)
      )]
      
      if (productIds.length > 0) {
        try {
          const productsData = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
            `/store/products`,
            {
              method: "GET",
              query: {
                id: productIds,
                region_id: region?.id,
                fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags"
              },
              headers: medusaHeaders,
              next: { revalidate: 3600 }
            }
          )
          
          const productMap = new Map()
          productsData.products?.forEach((product: any) => {
            productMap.set(product.id, product)
          })
          
          wishlist.items = wishlist.items.map((item: any) => {
            const productId = item.product_variant?.product_id || item.product_variant?.product?.id
            const completeProduct = productMap.get(productId)
            
            if (completeProduct) {
              const completeVariant = completeProduct.variants?.find((v: any) => 
                v.id === item.product_variant_id
              )
              
              if (completeVariant) {
                return {
                  ...item,
                  product_variant: {
                    ...item.product_variant,
                    ...completeVariant,
                    product: completeProduct
                  }
                }
              }
            }
            
            return item
          })
        } catch (error) {
          console.error('❌ Error enhancing shared wishlist items:', error)
        }
      }
    }
    
    return wishlist
  } catch (error) {
    console.error("Failed to fetch shared wishlist:", error)
    return null
  }
}

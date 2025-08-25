"use server"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { getProductPrice } from "@lib/util/get-product-price"
import { getRegion } from "@lib/data/regions"

export async function getCheapestProductPrice(productId: string, countryCode: string) {
  try {
    const region = await getRegion(countryCode)
    if (!region) return null
    const { products } = await sdk.store.product.list({
      id: [productId],
      region_id: region.id,
      fields: "*variants.calculated_price",
    })

    if (products.length > 0) {
      const product = products[0]
      const { cheapestPrice } = getProductPrice({ product: product as any })
      return cheapestPrice
    }
    return null
  } catch (error: any) {
    console.error("Error fetching product details in server action:", error)
    throw new Error(`Failed to fetch product details: ${error.message}`)
  }
}

// Server action to fetch products by category
export async function fetchProductsByCategory(categoryId: string, regionId: string): Promise<HttpTypes.StoreProduct[]> {
  try {
    const { products } = await sdk.store.product.list({
      category_id: categoryId,
      region_id: regionId,
      limit: 1,
    })
    
    return products || []
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}
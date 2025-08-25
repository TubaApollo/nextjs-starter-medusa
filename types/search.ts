import { ProductDTO, ProductCategoryDTO } from "@medusajs/types"
import { Hit, BaseHit } from "instantsearch.js/es/types/results"


export type ProductHit = Hit<BaseHit> & {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  min_price: number | null
  max_price: number | null
  variant_sku: string[]
  categories: string[]
  collection_title: string | null
  type: string | null
  tags: string[]
  status: string
  created_at: string
  updated_at: string
  variants: {
    id: string
    title: string
    sku: string | null
    inventory_quantity: number
    allow_backorder: boolean
    manage_inventory: boolean
    prices: {
      amount: number
      currency_code: string
      region_id?: string
    }[]
  }[]
}

export interface CategoryHit extends Hit<{
  id: string
  name: string
  handle: string
  description?: string
  thumbnail?: string
  parent_category_id?: string
  parent_category?: {
    id: string
    name: string
    handle: string
  } | null
  hierarchy_path: string[]      // ["Fachbodenregale", "Steckregale", "Einzelregal"]
  hierarchy_handles: string[]   // ["fachbodenregale", "steckregale", "einzelregal"]
  hierarchy_breadcrumb: string  // "Fachbodenregale → Steckregale → Einzelregal"
  level: number                 // 0 = root, 1 = child, 2 = grandchild, etc.
}> {}

export type SearchResults = {
  products: {
    hits: ProductHit[]
  }
  categories: {
    hits: CategoryHit[]
  }
}
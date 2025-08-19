import { ProductDTO, ProductCategoryDTO } from "@medusajs/types"
import { Hit, BaseHit } from "instantsearch.js/es/types/results"


export type ProductHit = Hit<BaseHit> & {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  min_price: number | null
  variant_sku: string[]
  variants: {
    id: string
    title: string
    inventory_quantity: number
    prices: {
      amount: number
      currency_code: string
    }[]
  }[]
}

export type CategoryHit = Hit<BaseHit> & {
  id: string
  name: string
  handle: string
  parent_category: {
    id: string
    name: string
    handle: string
  } | null
  thumbnail: string | null
}

export type SearchResults = {
  products: {
    hits: ProductHit[]
  }
  categories: {
    hits: CategoryHit[]
  }
}
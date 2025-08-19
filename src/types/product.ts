import { Product } from "@medusajs/medusa"

export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  collection_title: string | null
  prices?: any[]
  variants?: any[]
  collection?: any
  created_at?: any
  updated_at?: any
  deleted_at?: any
  metadata?: any
  profile_id?: any
  subtitle?: any
  description?: any
  options?: any
  images?: any
  status?: any
  weight?: any
  height?: any
  width?: any
  length?: any
  hs_code?: any
  origin_country?: any
  mid_code?: any
  material?: any
  discountable?: any
  external_id?: any
  is_giftcard?: any
  type?: any
  type_id?: any
  tags?: any
  profiles?: any
  profile?: any
  price?: {
    calculated_price: string
    original_price: string
    diff: string
    price_type: "default" | "sale"
  }
}

import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
// Swiper-based slider
import ProductSwiper from "./ProductSwiper"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-6 small:py-12">
      {/* Header styled to match hero/category aesthetics */}
      <div className="mb-4 small:mb-6">
        <div>
          <h2 className="txt-xlarge font-bold tracking-tight text-slate-900">
            {collection.title}
          </h2>
          <div className="mt-1 h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
        </div>
      </div>

      {/* Swiper slider: centered on mobile, controls on desktop */}
      <ProductSwiper>
        {pricedProducts.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} isFeatured />
        ))}
      </ProductSwiper>
    </div>
  )
}
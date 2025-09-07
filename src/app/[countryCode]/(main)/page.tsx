import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-cards"
import BrandShowcase from "@modules/home/components/brand-showcase"
import AboutKreckler from "@modules/home/components/about-kreckler"
import TabbedProductSlider from "@modules/home/components/tabbed-products"
import NewsletterBanner from "@modules/home/components/newsletter-banner"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

// Helper function to deeply serialize data and convert dates to strings
function deepSerialize(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (obj instanceof Date) {
    return obj.toISOString()
  }
  
  if (typeof obj === 'function') {
    return undefined // Remove functions
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSerialize).filter(item => item !== undefined)
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      const serializedValue = deepSerialize(value)
      if (serializedValue !== undefined) {
        serialized[key] = serializedValue
      }
    }
    return serialized
  }
  
  return obj
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // Fetch categories for the Hero component
  const categories = await listCategories()

  if (!collections || !region) {
    return null
  }

  // Fetch featured products for tabbed slider
  let featuredProducts: any[] = []
  if (collections.length > 0) {
    const {
      response: { products: pricedProducts },
    } = await listProducts({
      regionId: region.id,
      queryParams: {
        collection_id: collections[0].id, // Use first collection for now
        fields: "*variants.calculated_price",
      },
    })
    featuredProducts = pricedProducts || []
  }

  // Serialize categories to remove any non-serializable data
  const serializedCategories = deepSerialize(categories)
  const serializedFeaturedProducts = deepSerialize(featuredProducts)

  return (
    <>
      <Hero 
        categories={serializedCategories} 
        countryCode={countryCode}
        region={region}
      />
      <CategoryGrid categories={serializedCategories} />
      <div className="pt-2 pb-6">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <AboutKreckler />
      <BrandShowcase />
      <TabbedProductSlider 
        collections={collections} 
        region={region} 
        products={serializedFeaturedProducts}
      />
      <NewsletterBanner />
    </>
  )
}
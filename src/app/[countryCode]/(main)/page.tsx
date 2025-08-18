import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-cards"
import { listCollections } from "@lib/data/collections"
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

  // Serialize categories to remove any non-serializable data
  const serializedCategories = deepSerialize(categories)

  return (
    <>
      <Hero 
        categories={serializedCategories} 
        countryCode={countryCode}
        region={region}
      />
      <CategoryGrid />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
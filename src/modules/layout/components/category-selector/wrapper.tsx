"use client"

import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import CategorySelector from "./index"

interface CategorySelectorWrapperProps {
  categories: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
}

const CategorySelectorWrapper: React.FC<CategorySelectorWrapperProps> = ({
  categories,
  region,
}) => {
  const params = useParams() as { countryCode?: string }
  const countryCode = params?.countryCode || "de"

  return (
    <CategorySelector 
      categories={categories}
      countryCode={countryCode}
      region={region}
    />
  )
}

export default CategorySelectorWrapper

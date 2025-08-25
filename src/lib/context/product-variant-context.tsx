"use client"

import React, { createContext, useContext, useState } from "react"
import { HttpTypes } from "@medusajs/types"

type Ctx = {
  selectedVariant?: HttpTypes.StoreProductVariant
  setSelectedVariant: (v?: HttpTypes.StoreProductVariant) => void
}

const ProductVariantContext = createContext<Ctx | undefined>(undefined)

export const useProductVariant = () => {
  const ctx = useContext(ProductVariantContext)
  if (!ctx) {
    throw new Error("useProductVariant must be used within ProductVariantProvider")
  }
  return ctx
}

export const ProductVariantProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >()

  return (
    <ProductVariantContext.Provider value={{ selectedVariant, setSelectedVariant }}>
      {children}
    </ProductVariantContext.Provider>
  )
}

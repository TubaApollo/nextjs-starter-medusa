"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import ProductSwiper from "@modules/home/components/featured-products/product-rail/ProductSwiper"

// Tab configuration - will be replaced with actual categories later
const productTabs = [
  { id: "baumaschinen", label: "Baumaschinen", slug: "baumaschinen" },
  { id: "werkzeuge", label: "Werkzeuge", slug: "werkzeuge" },
  { id: "sicherheit", label: "Sicherheit", slug: "sicherheit" },
  { id: "transport", label: "Transport", slug: "transport" },
  { id: "heizung", label: "Heizung", slug: "heizung" },
]

interface TabbedProductSliderProps {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  products: HttpTypes.StoreProduct[] // Using featured products for all tabs for now
}

export default function TabbedProductSlider({ 
  collections, 
  region, 
  products 
}: TabbedProductSliderProps) {
  const [activeTab, setActiveTab] = useState(productTabs[0].id)

  return (
    <div className="content-container py-8 small:py-12">
      {/* Tab Navigation */}
      <div className="mb-6 small:mb-8">
        <div className="flex flex-wrap gap-2">
          {productTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                activeTab === tab.id
                  ? "text-red-600 bg-red-50 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {/* Active tab indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-8 h-0.5 bg-red-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Content */}
      <div className="min-h-[400px]">
        {productTabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? "block" : "hidden"}`}
          >
            {products && products.length > 0 ? (
              <ProductSwiper>
                {products.map((product) => (
                  <ProductPreview 
                    key={`${tab.id}-${product.id}`} 
                    product={product} 
                    region={region} 
                    isFeatured 
                  />
                ))}
              </ProductSwiper>
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">Keine Produkte verfügbar</p>
                  <p className="text-sm">Produkte für {tab.label} werden bald hinzugefügt.</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

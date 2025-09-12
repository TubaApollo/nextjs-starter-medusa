"use client"

import React, { useState } from "react"
import { useProductVariant } from "@lib/context/product-variant-context"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = ["Details", "Mehr Informationen", "Technische Daten", "Datenblätter"]
  const [active, setActive] = useState(tabs[0])

  return (
    <div className="w-full mt-8">
      <div className="border-t border-ui-border-base bg-ui-bg-muted/50 py-6">
        <nav className="flex items-center justify-center gap-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`relative pb-3 text-sm font-medium ${active === t ? 'text-ui-fg-base' : 'text-ui-fg-muted'}`}
            >
              {t}
              {active === t && <span className="absolute left-0 right-0 -bottom-1 mx-auto h-1 w-12 bg-yellow-400 rounded-full" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {active === "Details" && <ProductDetailsTab product={product} />}
        {active === "Mehr Informationen" && <ProductInfoTab product={product} />}
        {active === "Technische Daten" && <TechnicalDataTab product={product} />}
        {active === "Datenblätter" && <DatasheetsTab product={product} />}
      </div>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const { selectedVariant } = useProductVariant()
  const fallbackVariant = product.variants && product.variants.length === 1 ? product.variants[0] : undefined
  const sku = selectedVariant?.sku || fallbackVariant?.sku || "-"
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">SKU</span>
            <p>{sku}</p>
          </div>
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div>
          <span className="font-semibold">Fast delivery</span>
          <p className="max-w-sm">Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.</p>
        </div>
        <div>
          <span className="font-semibold">Simple exchanges</span>
          <p className="max-w-sm">Is the fit not quite right? No worries - we&apos;ll exchange your product for a new one.</p>
        </div>
        <div>
          <span className="font-semibold">Easy returns</span>
          <p className="max-w-sm">Just return your product and we&apos;ll refund your money. No questions asked – we&apos;ll do our best to make sure your return is hassle-free.</p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs

const ProductDetailsTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="prose max-w-none">
        {product.subtitle && (
          <>
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <p>{product.subtitle}</p>
          </>
        )}
        {product.description && (
          <>
            <h4 className="mt-4 font-semibold">Beschreibung</h4>
            <div className="mt-2 whitespace-pre-line">{product.description}</div>
          </>
        )}
      </div>
    </div>
  )
}

const TechnicalDataTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-2">
        <div>Gewicht: {product.weight ?? '-'}</div>
        <div>Abmessungen: {product.length && product.width && product.height ? `${product.length} x ${product.width} x ${product.height}` : '-'}</div>
      </div>
    </div>
  )
}

const DatasheetsTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">Keine Datenblätter vorhanden.</div>
  )
}

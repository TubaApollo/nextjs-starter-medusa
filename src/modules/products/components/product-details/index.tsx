import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type ProductDetailsProps = {
  product: HttpTypes.StoreProduct
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const collectionThumbnail = product?.collection?.metadata?.thumbnail as string | undefined
  const collectionTitle = product?.collection?.title as string | undefined
  return (
    <div id="product-details">
      <div className="flex flex-col gap-y-4 lg:max-w-[600px]">
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {/* Brand / Logo and SKU */}
        <div className="flex items-center gap-4 mt-2">
          {collectionThumbnail && (
            <img src={collectionThumbnail} alt={collectionTitle ?? ''} className="w-28 h-12 object-contain" />
          )}
          <div className="text-sm text-ui-fg-muted">
            <div>ART.-NR.: {product.handle}</div>
            {product?.collection && <div className="text-xs mt-1">{product.collection.title}</div>}
          </div>
        </div>

        {/* Move short subtitle / teaser into an overview block */}
        {product.subtitle && (
          <div className="mt-2 p-4 bg-ui-bg-subtle rounded-md">
            <Heading level="h3" className="text-lg font-semibold mb-2">Überblick</Heading>
            <Text className="text-medium text-ui-fg-subtle whitespace-pre-line">{product.subtitle}</Text>
          </div>
        )}

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line mt-4"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductDetails

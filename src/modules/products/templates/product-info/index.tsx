import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@lib/components/ui/breadcrumb"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const collectionThumbnail = product?.collection?.metadata?.thumbnail as string | undefined
  const collectionTitle = product?.collection?.title as string | undefined
  return (
  <div id="product-info" className="flex flex-col">
  <Breadcrumb className="mt-6 small:mt-8 mb-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {product.collection && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/collections/${product.collection.handle}`}>
                    {product.collection.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}

export default ProductInfo

import Image from "next/image"
import Link from "next/link"

export type ProductHit = {
  objectID: string
  id: string
  title: string
  handle: string
  thumbnail: string
  variant_sku?: string
}

type HitProps = {
  hit: ProductHit
  cheapestPrice?: any
  loading?: boolean
  error?: string | null
}

const Hit = ({ hit, cheapestPrice, loading, error }: HitProps) => {
  return (
    <Link href={`/products/${hit.handle}`}>
      <div className="grid grid-cols-[1fr_4fr] gap-4">
        <div className="relative w-full aspect-square">
          {hit.thumbnail && (
            <Image
              src={hit.thumbnail}
              alt={hit.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          )}
        </div>
        <div className="flex flex-col justify-between">
          <span className="text-base-regular font-semibold">{hit.title}</span>
          {hit.variant_sku && (
            <span className="text-small-regular text-ui-fg-subtle">
              Artikelnummer: {hit.variant_sku}
            </span>
          )}
          
          {loading && <div className="w-20 h-4 bg-gray-200 animate-pulse" />}
          {error && (
            <div className="flex items-center space-x-2">
              <span className="text-small-regular text-red-500">{error}</span>
            </div>
          )}
          {cheapestPrice && (
            <span className="text-small-regular text-ui-fg-subtle">
              {cheapestPrice.calculated_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default Hit

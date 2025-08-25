import { NextResponse } from "next/server"
import { addToCart } from "@lib/data/cart"
import { sdk } from "@lib/config"
import { getRegion } from "@lib/data/regions"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as any
    const variantId: string | undefined = body?.variantId
    const productHandle: string | undefined = body?.productHandle
    const productId: string | undefined = body?.productId
    const quantity: number = Number(body?.quantity ?? 1)
    const countryCode: string | undefined = body?.countryCode

    if (!variantId && !productHandle && !productId) return NextResponse.json({ error: "Missing variantId, productHandle or productId" }, { status: 400 })
    if (!countryCode) return NextResponse.json({ error: "Missing countryCode" }, { status: 400 })
    if (!Number.isFinite(quantity) || quantity < 1) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })

    let resolvedVariantId = variantId

    // Resolve region from countryCode for pricing context
    const region = await getRegion(countryCode!)
    if (!region?.id) {
      return NextResponse.json({ error: "Region not found for countryCode" }, { status: 400 })
    }

    if (!resolvedVariantId && productHandle) {
      // Resolve product by handle to get variant id
      const { products } = await sdk.client.fetch<{ products: any[] }>(
        "/store/products",
        {
          method: "GET",
          query: {
            handle: productHandle,
            limit: 1,
            fields: "*variants.calculated_price,+variants.inventory_quantity",
            region_id: region.id,
          },
          cache: "no-store",
        }
      )

      const product = products?.[0]
      const variants: any[] = Array.isArray(product?.variants) ? product.variants : []
      const inStock = variants.find((v) =>
        v?.allow_backorder || !v?.manage_inventory || (typeof v?.inventory_quantity === "number" && v.inventory_quantity > 0)
      )
      const chosen = inStock || variants[0]
      resolvedVariantId = chosen?.id
    }

    if (!resolvedVariantId && productId) {
      // Resolve product by ID to get variant id
      const { product } = await sdk.client.fetch<{ product: any }>(
        `/store/products/${productId}`,
        {
          method: "GET",
          query: {
            fields: "*variants.calculated_price,+variants.inventory_quantity",
            region_id: region.id,
          },
          cache: "no-store",
        }
      )

      const variants: any[] = Array.isArray(product?.variants) ? product.variants : []
      const inStock = variants.find((v) =>
        v?.allow_backorder || !v?.manage_inventory || (typeof v?.inventory_quantity === "number" && v.inventory_quantity > 0)
      )
      const chosen = inStock || variants[0]
      resolvedVariantId = chosen?.id
    }

    if (!resolvedVariantId) return NextResponse.json({ error: "No variant could be resolved" }, { status: 400 })

    await addToCart({ variantId: resolvedVariantId, quantity, countryCode })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to add to cart" }, { status: 500 })
  }
}

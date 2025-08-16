import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getProductPrice } from "@lib/util/get-product-price"
import { getOrSetCart } from "@lib/data/cart"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id
  const countryCode = request.nextUrl.searchParams.get("countryCode")

  if (!productId || !countryCode) {
    return NextResponse.json(
      { message: "Product ID and country code are required" },
      { status: 400 }
    )
  }

  try {
    const cart = await getOrSetCart(countryCode)
    const { products } = await sdk.store.product.list({
      id: [productId],
      region_id: cart?.region_id,
      fields: "*variants.calculated_price",
    })

    if (products.length > 0) {
      const product = products[0]
      const { cheapestPrice } = getProductPrice({ product: product as any })
      return NextResponse.json({ cheapestPrice })
    }
    return NextResponse.json({ cheapestPrice: null })
  } catch (error: any) {
    console.error("Error fetching product details in API route:", error)
    return NextResponse.json(
      { message: `Failed to fetch product details: ${error.message}` },
      { status: 500 }
    )
  }
}

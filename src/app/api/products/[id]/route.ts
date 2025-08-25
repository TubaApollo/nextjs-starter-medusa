import { NextRequest, NextResponse } from "next/server"
import { listProducts } from "@lib/data/products"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get('countryCode')

    if (!countryCode) {
      return NextResponse.json(
        { error: 'Country code is required' },
        { status: 400 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Try to get product by handle (most common case for search results)
    let product = await listProducts({
      countryCode,
      queryParams: { handle: id } as any,
    }).then(({ response }) => response.products[0])

    // If not found by handle, try by ID
    if (!product) {
      product = await listProducts({
        countryCode,
        queryParams: { id: [id] } as any,
      }).then(({ response }) => response.products[0])
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
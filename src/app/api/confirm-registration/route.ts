import { NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ success: false, error: "token is required" }, { status: 400 })
    }

    const proxied = await fetch(`${BACKEND_URL}/store/confirm-registration?token=${encodeURIComponent(token)}`, {
      method: "GET",
      headers: {
        ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
      },
    })

    const text = await proxied.text()

    // Try to forward content-type if present
    const contentType = proxied.headers.get("content-type") || "application/json"

    return new Response(text, { status: proxied.status, headers: { "Content-Type": contentType } })
  } catch (err: any) {
    const message = err?.message || String(err)
    try {
      console.error("Proxy confirm-registration error:", message)
    } catch (e) {
      // ignore
    }
    return NextResponse.json({ success: false, error: message }, { status: 502 })
  }
}

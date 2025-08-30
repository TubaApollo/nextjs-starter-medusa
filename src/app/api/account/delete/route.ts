import { deleteCustomerAccount } from "@lib/data/customer"

export async function POST() {
  try {
    const res = await deleteCustomerAccount()

    if (res.success) {
      const body = JSON.stringify({ success: true })
      return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } })
    }

    // Ensure we always return a useful error string
    const errorMessage = res?.error ?? "Unknown error while deleting account"
    // Log server-side for debugging
    try {
      console.error("Account delete failed:", errorMessage)
    } catch (e) {
      // ignore logging errors
    }

    const body = JSON.stringify({ success: false, error: String(errorMessage) })
    return new Response(body, { status: 500, headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    const message = err?.message || String(err) || "Unknown server error"
    try {
      console.error("Account delete exception:", message)
    } catch (e) {
      // ignore
    }
    const body = JSON.stringify({ success: false, error: String(message) })
    return new Response(body, { status: 500, headers: { "Content-Type": "application/json" } })
  }
}

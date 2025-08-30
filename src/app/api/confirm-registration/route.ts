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

    // respect client's Accept header or ?format=json
    const incomingAccept = req.headers.get("accept") || ""
    const wantJson = incomingAccept.includes("application/json") || url.searchParams.get("format") === "json"

    let proxied: Response
    try {
      const proxiedHeaders: Record<string, string> = {
        ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
      }

      if (wantJson) {
        proxiedHeaders["accept"] = "application/json"
      }

      proxied = await fetch(`${BACKEND_URL.replace(/\/$/, "")}/store/confirm-registration?token=${encodeURIComponent(token)}`, {
        method: "GET",
        headers: proxiedHeaders,
        redirect: "manual",
      })
    } catch (fetchErr: any) {
      const ferrMsg = fetchErr?.message || String(fetchErr)
      try {
        console.error(`Proxy fetch to ${BACKEND_URL} failed:`, fetchErr)
      } catch (e) {
        // ignore logging errors
      }

      // Include more details to help debugging. Only include stack in non-production.
      const details: any = { backendUrl: BACKEND_URL, fetchError: ferrMsg }
      if (process.env.NODE_ENV !== "production" && fetchErr?.stack) {
        details.fetchStack = String(fetchErr.stack)
      }

      // Return a more actionable message for devs
      return NextResponse.json({ success: false, error: `Server fetch failed: ${ferrMsg}`, details }, { status: 502 })
    }

    const text = await proxied.text()

    // If proxied responded with a redirect, convert to a JSON success for XHR clients
    if (proxied.status >= 300 && proxied.status < 400) {
      const rawLocation = proxied.headers.get("location") || null

      // Fix for malformed Location headers that contain comma-separated lists
      let location = rawLocation
      if (location && location.includes(",")) {
        const parts = location.split(",").map((s) => s.trim()).filter(Boolean)
        // Prefer a part that looks like a full URL with a path (e.g. contains '/login' or query string)
        const preferred = parts.find((p) => /https?:\/\//.test(p) && (p.includes("/") && (p.includes("/login") || p.includes("?"))))
        location = preferred || parts[parts.length - 1] || parts[0]
      }

      // Validate the chosen location; fallback to root if invalid
      try {
        if (location) new URL(location)
      } catch (e) {
        location = "/"
      }

      // If client asked for JSON, return a JSON success describing redirect (include rawLocation for debug)
      if (wantJson) {
        if (process.env.NODE_ENV !== "production") {
          try {
            // Log useful debug info from backend for developers (do not log in production)
            console.debug("Proxy redirect debug:", {
              backendStatus: proxied.status,
              rawLocation,
              chosenLocation: location,
              headers: Array.from(proxied.headers.entries()),
              body: text,
            })
          } catch (e) {
            // ignore logging errors
          }
        }

        // rotate cache id so server-side cache tags revalidate for this customer
        const newCacheId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const out = NextResponse.json(
          { success: true, action: "fallback", message: "redirected", redirectTo: location, rawLocation },
          { status: 200 }
        )
        try {
          out.cookies.set("_medusa_cache_id", newCacheId, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
          })
        } catch (e) {
          // ignore cookie set errors
        }
        return out
      }

      // Otherwise, forward the redirect to the browser consumer
      return NextResponse.redirect(location || "/", proxied.status)
    }

    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch (e) {
      json = null
    }

    // Map backend response to required JSON shapes
  if (proxied.status === 200) {
      // If the backend returned an auth identity id or similar, treat as attached
      const authId = json?.auth_identity_id ?? json?.authIdentityId ?? json?.identity_id ?? json?.auth_identity?.id ?? null

      if (authId) {
        const newCacheId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const out = NextResponse.json(
          { success: true, action: "attached", result: json?.result ?? json ?? null, authIdentityId: String(authId) },
          { status: 200 }
        )
        try {
          out.cookies.set("_medusa_cache_id", newCacheId, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
          })
        } catch (e) {
          // ignore
        }
        return out
      }

      // If backend indicates has_account or similar, fallback
      if (json?.has_account === true || (json?.message && typeof json.message === "string" && json.message.includes("has_account"))) {
        const newCacheId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const out = NextResponse.json({ success: true, action: "fallback", message: "marked has_account" }, { status: 200 })
        try {
          out.cookies.set("_medusa_cache_id", newCacheId, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
          })
        } catch (e) {
          // ignore
        }
        return out
      }

      // Generic success fallback (no identity found, assume marked)
      const newCacheId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const out = NextResponse.json({ success: true, action: "fallback", message: "marked has_account", result: json ?? null }, { status: 200 })
      try {
        out.cookies.set("_medusa_cache_id", newCacheId, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })
      } catch (e) {
        // ignore
      }
      return out
    }

    // Handle client errors from backend (e.g., invalid / expired token)
    if (proxied.status === 400) {
      return NextResponse.json({ success: false, error: json?.error ?? json?.message ?? "Invalid or expired token" }, { status: 400 })
    }

    // For other non-200 responses treat as workflow failure
    const errDetail = json?.error ?? json?.message ?? text ?? "Failed to attach customer to auth identity"
    try {
      console.error(`Proxy received ${proxied.status} from backend:`, errDetail)
    } catch (e) {
      // ignore
    }

    if (process.env.NODE_ENV !== "production") {
      try {
        console.debug("Proxy backend non-200 response debug:", {
          backendStatus: proxied.status,
          headers: Array.from(proxied.headers.entries()),
          rawBody: text,
          parsedJson: json,
        })
      } catch (e) {
        // ignore logging errors
      }
    }

    return NextResponse.json({ success: false, error: errDetail, backendStatus: proxied.status }, { status: 500 })
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

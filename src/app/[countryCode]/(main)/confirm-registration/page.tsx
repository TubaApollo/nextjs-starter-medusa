"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PROXY_ENDPOINT = "/api/confirm-registration"

export default function ConfirmRegistrationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState("Confirming your registration...")
  const [status, setStatus] = useState<number | null>(null)
  const [responseText, setResponseText] = useState<string | null>(null)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setMessage("No confirmation token found.")
      return
    }

    let mounted = true

    const confirm = async () => {
      try {
        // Request JSON so proxy/backend returns structured responses instead of redirects
        const url = `${PROXY_ENDPOINT}?token=${encodeURIComponent(token)}&format=json`
        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          // optional: prevent automatic redirect following so we can inspect redirect responses
          redirect: "manual",
        })

        // Prevent double-execution in React Strict Mode (dev) or accidental re-renders
        // Use a simple guard stored on window to survive mount/unmount during dev double-render
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const w = window as any
          if (w.__confirmRegistrationCalled && w.__confirmRegistrationCalled === token) {
            return
          }
          w.__confirmRegistrationCalled = token
        } catch (e) {
          // ignore if window isn't available for some reason
        }
        if (!mounted) return

  setStatus(res.status)

        // Parse JSON response from proxy
        let json: any = null
        try {
          json = await res.json()
        } catch (e) {
          json = null
        }

        if (res.ok && json?.success) {
          // treat attached, already_attached and fallback as success
          const action = json.action
          if (action === "attached" || action === "already_attached" || action === "fallback") {
            setMessage(json.message || "Your registration has been confirmed. Redirecting to your account...")
            setResponseText(JSON.stringify(json, null, 2))
            setTimeout(() => {
              try {
                window.dispatchEvent(new Event('auth-changed'))
              } catch (e) {
                // ignore
              }
              router.push(`/${getCountryFromPath()}/account`)
            }, 2500)
            return
          }

          // Generic success when backend says success but action is unexpected
          setMessage("Your registration has been confirmed! Redirecting to your account...")
          setResponseText(JSON.stringify(json, null, 2))
          setTimeout(() => {
            try {
              window.dispatchEvent(new Event('auth-changed'))
            } catch (e) {
              // ignore
            }
            router.push(`/${getCountryFromPath()}/account`)
          }, 2500)
          return
        }

        // Handle client error (invalid/expired token)
        if (res.status === 400) {
          const errMsg = json?.error ?? json?.message ?? "Invalid or expired token"
          setResponseText(JSON.stringify(json ?? { error: errMsg }, null, 2))
          setMessage(`Confirmation failed: ${errMsg}`)
          console.error('Confirm registration invalid token', errMsg)
          return
        }

        // Other errors -> workflow failure
        const errMsg = json?.error ?? json?.message ?? "Failed to attach customer to auth identity"
        setResponseText(JSON.stringify(json ?? { error: errMsg }, null, 2))
        // If proxy returned backend status or details, show actionable guidance
        if (res.status === 502 || json?.error?.toLowerCase?.().includes('server fetch failed') || json?.details) {
          setMessage(`Confirmation failed: ${errMsg}. Check that your Medusa backend is running and that NEXT_PUBLIC_MEDUSA_BACKEND_URL / MEDUSA_BACKEND_URL is correct.`)
          console.error('Confirm registration proxy/server fetch failure', { status: res.status, body: json })
          return
        }

        setMessage(`Confirmation failed: ${errMsg}`)
        console.error('Confirm registration workflow failure', errMsg)
      } catch (err: any) {
        // Network error or CORS or DNS issue (e.g., "Failed to fetch")
        console.error('Confirm registration fetch error', err)
        if (!mounted) return
        const detail = err?.message || String(err)
        setErrorDetail(detail)
        setMessage(`An error occurred during confirmation: ${detail}`)
      }
    }

    confirm()

    return () => {
      mounted = false
    }
  }, [token, router])

  // helper to keep routing consistent with countryCode in URL
  function getCountryFromPath() {
    try {
      const path = window.location.pathname
      const parts = path.split("/").filter(Boolean)
      // if first segment looks like country code (two letters) return it
      if (parts.length && parts[0].length === 2) return parts[0]
    } catch (e) {
      // ignore
    }
    return ""
  }

  return (
    <div className="w-full flex items-center justify-center p-8 min-h-[60vh]">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Registration Confirmation</h1>
        <p className="text-base text-muted-foreground">{message}</p>
        {/* Debug panel */}
        {(status !== null || responseText || errorDetail) && (
          <div className="mt-6 text-left bg-gray-50 dark:bg-slate-900 border rounded-md p-4 text-sm">
            <div className="mb-2 font-medium">Debug info</div>
            {status !== null && <div><strong>HTTP status:</strong> {status}</div>}
            {responseText && (
              <div className="mt-2">
                <strong>Response body:</strong>
                <pre className="whitespace-pre-wrap mt-1">{responseText}</pre>
              </div>
            )}
            {errorDetail && (
              <div className="mt-2"><strong>Error:</strong> {errorDetail}</div>
            )}
            <div className="mt-3 text-xs text-muted-foreground">
              <div>Proxy endpoint: <code>{PROXY_ENDPOINT}</code></div>
              <div>Request proxied server-side to Medusa store endpoint</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

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
        const res = await fetch(`${PROXY_ENDPOINT}?token=${encodeURIComponent(token)}`, {
          method: "GET",
        })

        if (!mounted) return

        setStatus(res.status)

        // Treat any status < 400 as success (covers some proxied redirects or no-content responses)
        if (res.status < 400) {
          setMessage("Your registration has been confirmed! Redirecting to login...")
          setTimeout(() => router.push(`/${getCountryFromPath()}/account/login?confirmed=true`), 2500)
          return
        }

        // Try to get JSON first, then text
        let bodyText = null
        try {
          const json = await res.json()
          bodyText = JSON.stringify(json)
        } catch (e) {
          try {
            bodyText = await res.text()
          } catch (__) {
            bodyText = null
          }
        }

  const displayBody = bodyText === null || bodyText === "" ? "(empty)" : bodyText
  setResponseText(displayBody)
  setMessage(`Confirmation failed: ${displayBody ?? `status ${res.status}`}`)
  // Only log as error for >=400 statuses
  console.error(`Confirm registration failed status=${res.status}`, displayBody)
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

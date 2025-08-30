"use client"

import React, { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@lib/components/ui/alert"
import { Button } from "@lib/components/ui/button"
import { HttpTypes } from "@medusajs/types"

type Props = {
  customer?: HttpTypes.StoreCustomer | null
}

function isConfirmed(customer?: HttpTypes.StoreCustomer | null) {
  if (!customer) return false
  const c = customer as any

  // Direct boolean flags
  if (c.confirmed === true) return true
  if (c.email_verified === true) return true
  if (c.is_verified === true) return true
  if (c.verified === true) return true
  if (c.has_confirmed === true) return true
  // Treat has_account (best-effort) as an indicator the user has an account and should not see the banner
  if (c.has_account === true) return true

  // Timestamp-ish fields
  const tsFields = [
    "confirmed_at",
    "email_confirmed_at",
    "email_verified_at",
    "verified_at",
    "confirmedAt",
    "emailConfirmedAt",
  ]
  for (const f of tsFields) {
    if (c[f]) return true
  }

  // metadata may contain a string flag
  const meta = c.metadata
  if (meta) {
    const truthy = [true, "true", "1", "yes"]
    if (truthy.includes(meta.email_confirmed) || truthy.includes(meta.emailConfirmed) || truthy.includes(meta.confirmed)) return true
  }

  // Some backends place verification state on a nested auth object
  if (c.auth && (c.auth.email_verified === true || c.auth.confirmed === true)) return true

  return false
}

export default function EmailConfirmationBanner({ customer }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!customer) return null
  if (isConfirmed(customer)) return null

  if (process.env.NODE_ENV !== "production") {
    try {
      // Log customer object to help debug why banner is showing (use console.log for visibility)
      // This logs to the browser console because this is a client component.
      // If you don't see this, open DevTools -> Console on the browser where the account page is rendered.
      // Note: keep logs out of production.
      // eslint-disable-next-line no-console
      const c = customer as any
      const debugInfo = {
        id: c.id,
        email: c.email,
        confirmed: c.confirmed,
        email_verified: c.email_verified,
        is_verified: c.is_verified,
        verified: c.verified,
        has_confirmed: c.has_confirmed,
        has_account: c.has_account,
        // timestamp fields
        confirmed_at: c.confirmed_at,
        email_confirmed_at: c.email_confirmed_at,
        email_verified_at: c.email_verified_at,
        verified_at: c.verified_at,
        // metadata
        metadata: c.metadata,
      }
      console.log("EmailConfirmationBanner (debug): customer appears unconfirmed", debugInfo)
      // Also print full JSON for inspection
      try {
        console.log("EmailConfirmationBanner (debug): full customer JSON:\n", JSON.stringify(customer, null, 2))
      } catch (e) {
        // ignore stringify errors
      }
    } catch (e) {
      // ignore
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      const body: any = {}
      if (customer.email) body.email = customer.email
      else if (customer.id) body.customer_id = customer.id

      const res = await fetch(`/store/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      })

      const data = await (async () => {
        try {
          return await res.json()
        } catch (e) {
          return null
        }
      })()

      if (res.ok && data?.success) {
        setMessage("Bestätigungs-Link wurde erneut gesendet. Bitte prüfen Sie Ihre E-Mails.")
      } else {
        const err = data?.error || data?.message || `Fehler beim Senden (${res.status})`
        setError(String(err))
      }
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <Alert className="border-orange-200 bg-orange-50 text-orange-800">
        <div className="flex-1">
          <AlertTitle className="text-orange-800">Bitte bestätigen Sie Ihre E-Mail</AlertTitle>
          <AlertDescription className="text-orange-700">Bitte bestätigen Sie Ihre Mail um alle Funktionen nutzen zu können.</AlertDescription>
          <div className="mt-3 flex items-center gap-3">
            <Button size="sm" onClick={handleResend} disabled={loading}>
              {loading ? "Sende…" : "Erneut senden"}
            </Button>
            {message && <div className="text-sm text-green-700">{message}</div>}
            {error && <div className="text-sm text-red-700">{error}</div>}
          </div>
        </div>
      </Alert>
    </div>
  )
}

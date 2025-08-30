"use client"

import { useEffect } from "react"
import { useCustomer } from "@lib/context/customer-context"

export default function DashboardTitleClient() {
  const { isAuthenticated, isLoading } = useCustomer()

  useEffect(() => {
    if (isLoading) return

    // Only set the title when the client has determined the user is authenticated.
    // Avoid setting a "Sign in" fallback which can briefly overwrite the server title
    // during client-side auth refreshes.
    if (isAuthenticated) {
      document.title = "Übersicht"
    }
  }, [isAuthenticated, isLoading])

  return null
}

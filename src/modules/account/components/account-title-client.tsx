"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useCustomer } from "@lib/context/customer-context"

export default function AccountTitleClient() {
  const pathname = usePathname() || ""
  const { isAuthenticated, isLoading } = useCustomer()

  useEffect(() => {
    if (isLoading) return

    // Normalize route to account-relative path
    const route = pathname.replace(/\/[^\/]*$/, (s) => s) // noop to keep TS happy
    // Determine simple title mapping for account subpages
    if (pathname.endsWith("/account") || pathname.endsWith("/account/") || pathname.match(/\/account(\/)?$/)) {
      if (isAuthenticated) document.title = "Übersicht"
      return
    }

    if (pathname.includes("/account/settings")) {
      document.title = "Kontoeinstellungen"
      return
    }

    if (pathname.includes("/account/profile")) {
      document.title = "Profil"
      return
    }

    if (pathname.includes("/account/orders")) {
      document.title = "Bestellungen"
      return
    }

    if (pathname.includes("/account/addresses")) {
      document.title = "Adressen"
      return
    }

    // For other account-like routes do nothing and allow server metadata to remain.
  }, [pathname, isAuthenticated, isLoading])

  return null
}

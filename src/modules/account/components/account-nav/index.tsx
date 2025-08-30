"use client"

import { useState } from "react"
import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { HomeIcon, UserIcon, MapPinIcon, ShoppingBagIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import { useParams, usePathname, useRouter } from "next/navigation"

// ...existing code...
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { logoutWithAuthSync } from "@lib/client/auth"

/**
 * Redesigned dark sidebar styled to match screenshot:
 * - Dark background, rounded corners
 * - Subtle red accent for active item and small badges
 * - Grouped sections with icons
 */
const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname() || ""
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const success = await logoutWithAuthSync()
      if (success) {
        router.push(`/${countryCode}/account`)
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="p-4 small:p-6 h-full min-h-[320px] flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-red-50 flex items-center justify-center text-red-700 font-semibold">
          {customer?.first_name?.[0] ?? "U"}
        </div>
        <div>
          <div className="text-base-semi text-foreground">{customer?.first_name} {customer?.last_name}</div>
          <div className="text-small-regular text-muted-foreground">Mitglied seit {customer?.created_at ? String(customer.created_at).split("T")?.[0] : "-"}</div>
        </div>
      </div>

      <nav className="flex-1">
          <Section title="Konto">
            <NavItem href="/account" route={route} icon={<HomeIcon className="w-5 h-5" />} data-testid="overview-link">Übersicht</NavItem>
              <NavItem href="/account/profile" route={route} icon={<UserIcon className="w-5 h-5" />} data-testid="profile-link">Profil</NavItem>
            <NavItem href="/account/addresses" route={route} icon={<MapPinIcon className="w-5 h-5" />} data-testid="addresses-link">Adressen</NavItem>
            <NavItem href="/account/orders" route={route} icon={<ShoppingBagIcon className="w-5 h-5" />} data-testid="orders-link">Bestellungen</NavItem>
        </Section>

        <Section title="Einstellungen">
            <NavItem href="/account/settings" route={route} data-testid="settings-link" icon={<Cog6ToothIcon className="w-5 h-5 opacity-90" />}>
              Kontoeinstellungen
            </NavItem>
        </Section>
      </nav>

      <div>
        <div className="flex items-center justify-between gap-4">
            <button onClick={handleLogout} disabled={isLoggingOut} className={clx("w-full py-2 rounded-md flex items-center justify-center gap-2 text-sm border", {
            "bg-white text-red-600 border-red-100 hover:bg-red-50": !isLoggingOut,
            "bg-red-50 text-red-300 cursor-not-allowed": isLoggingOut,
          })} data-testid="logout-button">
            <ArrowRightOnRectangle />
            <span>{isLoggingOut ? "Abmelden..." : "Abmelden"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="mb-4">
      <div className="px-2 pb-2 text-small-regular text-ui-fg-subtle">{title}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

type NavItemProps = {
  href: string
  route: string
  icon?: React.ReactNode
  children: React.ReactNode
  "data-testid"?: string
}

const NavItem = ({ href, route, icon, children, "data-testid": dataTestId }: NavItemProps) => {
  // route: e.g. "/de/account"; href: "/account"
  const params = useParams() as { countryCode?: string }
  const countryCode = params?.countryCode

  const normalizedRoute = route || ""
  // Consider active if the route ends with the href (handles /de/account and /account)
  const active = normalizedRoute === href || normalizedRoute.endsWith(href) || (countryCode ? normalizedRoute === `/${countryCode}${href}` : false)

  return (
    <LocalizedClientLink href={href} data-testid={dataTestId} className={clx("flex items-center gap-3 py-2 px-3 rounded-md text-sm", {
      "bg-red-50 text-red-700 ring-1 ring-red-200": active,
      "text-muted-foreground hover:bg-gray-50": !active,
    })}>
      <span className="opacity-90">{icon}</span>
      <span className={clx({ "font-semibold": active })}>{children}</span>
      {active ? <span className="ml-auto text-red-500 text-xs">●</span> : null}
    </LocalizedClientLink>
  )
}

export default AccountNav

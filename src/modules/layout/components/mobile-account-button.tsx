"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { UserIcon } from "@heroicons/react/24/outline"

export default function MobileAccountButton() {
  return (
    <div className="md:hidden flex items-center">
      <LocalizedClientLink
        className="flex items-center justify-center h-10 w-10 text-gray-600 hover:text-gray-900"
        href="/account"
        data-testid="nav-account-link"
      >
  <UserIcon className="w-6 h-6" aria-hidden="true" />
      </LocalizedClientLink>
    </div>
  )
}

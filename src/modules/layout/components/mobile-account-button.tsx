"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { UserIcon } from "@heroicons/react/24/outline"

export default function MobileAccountButton() {
  return (
    <div className="md:hidden flex items-center">
      <LocalizedClientLink
        className="hover:text-ui-fg-base flex items-center gap-1"
        href="/account"
        data-testid="nav-account-link"
      >
        <UserIcon className="w-5 h-5" aria-hidden="true" />
      </LocalizedClientLink>
    </div>
  )
}

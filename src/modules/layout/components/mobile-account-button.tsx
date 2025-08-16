"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FaUser } from "react-icons/fa"

export default function MobileAccountButton() {
  return (
    <div className="xl:hidden flex items-center">
      <LocalizedClientLink
        className="hover:text-ui-fg-base flex items-center gap-1"
        href="/account"
        data-testid="nav-account-link"
      >
        <FaUser size={18} aria-hidden="true" />
      </LocalizedClientLink>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

/**
 * Client-side link that prepends current countryCode when needed.
 * Avoids double-prefixing when `href` already contains the countryCode.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const params = useParams() as { countryCode?: string }
  const countryCode = params?.countryCode

  // If href is absolute or starts with protocol, return as-is
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  // Ensure href starts with a single leading slash
  const normalizedHref = href.startsWith("/") ? href : `/${href}`

  // If we don't have a countryCode, just use normalizedHref
  if (!countryCode) {
    return (
      <Link href={normalizedHref} {...props}>
        {children}
      </Link>
    )
  }

  // If the href already includes the country code at the start, don't prefix again
  if (normalizedHref.startsWith(`/${countryCode}/`) || normalizedHref === `/${countryCode}`) {
    return (
      <Link href={normalizedHref} {...props}>
        {children}
      </Link>
    )
  }

  const finalHref = `/${countryCode}${normalizedHref}`

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink

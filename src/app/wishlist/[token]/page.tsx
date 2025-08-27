import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveSharedWishlist } from "@lib/data/wishlist"
import SharedWishlistTemplate from "@modules/wishlist/templates/shared-wishlist"

export const metadata: Metadata = {
  title: "Geteilte Merkliste",
  description: "Geteilte Merkliste ansehen",
}

export default async function SharedWishlistPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const wishlist = await retrieveSharedWishlist(token)

  if (!wishlist) {
    notFound()
  }

  return <SharedWishlistTemplate wishlist={wishlist} token={token} />
}

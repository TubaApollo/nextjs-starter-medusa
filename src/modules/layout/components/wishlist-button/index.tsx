import { retrieveWishlist } from "@lib/data/wishlist"
import WishlistNavIcon from "../wishlist-nav-icon"

export default async function WishlistButton() {
  const wishlist = await retrieveWishlist().catch(() => null)
  // Don't pass a zero count to the client to avoid briefly showing a 0 badge.
  const initialTotal = (wishlist?.items?.length ?? 0) > 0 ? wishlist?.items?.length : undefined

  // Render client component with initial total from server
  return <WishlistNavIcon initialTotal={initialTotal} />
}

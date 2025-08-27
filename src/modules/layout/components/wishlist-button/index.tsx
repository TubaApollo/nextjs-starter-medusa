import { retrieveWishlist } from "@lib/data/wishlist"
import WishlistDropdown from "../wishlist-dropdown"

export default async function WishlistButton() {
  // We don't need to pass the wishlist here since WishlistDropdown 
  // will get it from the WishlistProvider context
  return <WishlistDropdown />
}

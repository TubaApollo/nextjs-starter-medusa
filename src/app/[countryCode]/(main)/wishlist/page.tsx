import { Metadata } from "next"
import WishlistTemplate from "@modules/wishlist/templates"

export const metadata: Metadata = {
  title: "Merkliste",
  description: "Ihre gespeicherten Produkte",
}

export default function WishlistPage() {
  return <WishlistTemplate />
}

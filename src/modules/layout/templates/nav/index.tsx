
import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import WishlistNavIcon from "@modules/layout/components/wishlist-nav-icon"
import SideMenu from "@modules/layout/components/side-menu"
import SearchWrapper from "@modules/layout/components/search-wrapper"
import MobileSearchButton from "@modules/layout/components/mobile-search-button"
import MobileAccountButton from "@modules/layout/components/mobile-account-button"
import { UserIcon, HeartIcon } from "@heroicons/react/24/outline"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          {/* Left: Medusa Store and Mobile Burger Menu */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full xl:hidden">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase hidden xl:block"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Middle: Search (now visible on all screen sizes) */}
          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-lg">
              <SearchWrapper />
            </div>
          </div>

          {/* Right: Kundencenter, Mobile Search, Mobile Account, Wishlist, and Cart */}
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden md:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center gap-1"
                href="/account"
                data-testid="nav-account-link"
              >
                <UserIcon className="w-5 h-5" aria-hidden="true" />
                <span>Kundencenter</span>
              </LocalizedClientLink>
            </div>
            <MobileAccountButton />
            <MobileSearchButton />
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/wishlist"
                  data-testid="nav-wishlist-link"
                >
                  <HeartIcon className="w-6 h-6" />
                </LocalizedClientLink>
              }
            >
              <WishlistNavIcon />
            </Suspense>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}

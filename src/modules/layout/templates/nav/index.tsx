
import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchWrapper from "@modules/layout/components/search-wrapper"
import MobileSearchButton from "@modules/layout/components/mobile-search-button" // Import MobileSearchButton
import MobileAccountButton from "@modules/layout/components/mobile-account-button" // Import MobileAccountButton
import { FaUser } from "react-icons/fa" // Import FaUser

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
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase hidden xl:block" // Hide on mobile, show on desktop
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Middle: Search (wider) */}
          <div className="flex-1 flex justify-center">
            <div className="hidden xl:flex w-full max-w-full"> {/* Wider search on desktop */}
              <SearchWrapper />
            </div>
          </div>

          {/* Right: Kundencenter, Mobile Search, Mobile Account, and Cart */}
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end"> {/* Changed gap-x-6 to gap-x-4 */}
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                  data-testid="nav-search-link"
                >
                  Search
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center gap-1"
                href="/account"
                data-testid="nav-account-link"
              >
                <FaUser size={18} aria-hidden="true" /> {/* Add FaUser icon */}
                <span>Kundencenter</span>
              </LocalizedClientLink>
            </div>
            <MobileAccountButton /> {/* Add MobileAccountButton here */}
            <MobileSearchButton /> {/* Move MobileSearchButton here */}
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

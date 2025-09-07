
import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import WishlistButton from "@modules/layout/components/wishlist-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchWrapper from "@modules/layout/components/search-wrapper"
import MobileSearchButton from "@modules/layout/components/mobile-search-button"
import MobileAccountButton from "@modules/layout/components/mobile-account-button"
import CategorySelectorWrapper from "@modules/layout/components/category-selector/wrapper"
import { UserIcon, HeartIcon, ShoppingBagIcon as ShoppingBag, PhoneIcon } from "@heroicons/react/24/outline"

// Helper function to deeply serialize data and convert dates to strings
function deepSerialize(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (obj instanceof Date) {
    return obj.toISOString()
  }
  
  if (typeof obj === 'function') {
    return undefined // Remove functions
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSerialize).filter(item => item !== undefined)
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      const serializedValue = deepSerialize(value)
      if (serializedValue !== undefined) {
        serialized[key] = serializedValue
      }
    }
    return serialized
  }
  
  return obj
}

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories()
  const serializedCategories = deepSerialize(categories)
  
  // Get the first region for the category selector (fallback)
  const defaultRegion = regions[0]

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">
        {/* Main Navigation Bar */}
        <nav className="content-container txt-xsmall-plus text-gray-600 flex items-center justify-between w-full h-20 text-small-regular">
          {/* Left: Mobile Burger Menu and Logo */}
          <div className="flex-1 basis-0 h-full flex items-center justify-between">
            <div className="h-full md:hidden">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              data-testid="nav-store-link"
            >
              <img 
                src="/media/kreckler.svg" 
                alt="Kreckler Logo" 
                className="h-16 md:h-20 w-auto"
              />
            </LocalizedClientLink>
          </div>

          {/* Middle: Search (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex w-full max-w-lg">
              <SearchWrapper />
            </div>
          </div>

          {/* Hidden SearchWrapper for mobile overlay functionality */}
          <div className="md:hidden">
            <SearchWrapper />
          </div>

          {/* Right: Desktop Kundencenter and Wishlist (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                href="/account"
                data-testid="nav-account-link"
              >
                <UserIcon className="w-7 h-7" aria-hidden="true" />
                <span>Kundencenter</span>
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-gray-600 hover:text-gray-900 flex gap-2"
                  href="/wishlist"
                  data-testid="nav-wishlist-link"
                >
                  <HeartIcon className="w-7 h-7" />
                </LocalizedClientLink>
              }
            >
              <WishlistButton />
            </Suspense>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-gray-600 hover:text-gray-900 flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <ShoppingBag className="w-7 h-7" />
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
        
        {/* Category Navigation Bar */}
        <div className="w-full border-t border-gray-100 bg-gray-50 relative">
          <div className="content-container">
            <div className="flex items-center justify-between py-2 md:py-3 gap-4">
              {/* Left: Category Selector */}
              <div className="flex-1 min-w-0">
                {defaultRegion && (
                  <CategorySelectorWrapper 
                    categories={serializedCategories} 
                    region={defaultRegion}
                  />
                )}
              </div>
              
              {/* Right: Mobile Search + Cart OR Desktop Phone Support */}
              <div className="flex items-center gap-3">
                {/* Mobile Search and Cart - only visible on mobile */}
                <div className="flex md:hidden items-center gap-3">
                  <MobileSearchButton />
                  <Suspense
                    fallback={
                      <LocalizedClientLink
                        className="text-gray-600 hover:text-gray-900 flex gap-2"
                        href="/cart"
                        data-testid="nav-cart-link"
                      >
                        <ShoppingBag className="w-6 h-6" />
                      </LocalizedClientLink>
                    }
                  >
                    <CartButton />
                  </Suspense>
                </div>
                
                {/* Desktop Phone Support - only visible on large screens */}
                <div className="hidden lg:flex flex-col items-end text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
                  <span className="text-xs text-gray-500 leading-none mb-1">MO - FR: 07:30 - 17:00</span>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5" />
                    <a 
                      href="tel:+4900000000000" 
                      className="text-sm font-medium text-gray-900 hover:text-red-500 transition-colors leading-none whitespace-nowrap"
                    >
                      +49 (0)000 000 0000
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

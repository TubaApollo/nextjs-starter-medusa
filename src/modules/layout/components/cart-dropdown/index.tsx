"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@lib/components/ui/popover"
// using native overflow for reliable scroll in popovers
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@lib/components/ui/button"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"

type CartDropdownProps = {
  cart?: HttpTypes.StoreCart | null
}

const CartDropdown = ({ cart: cartState }: CartDropdownProps) => {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | undefined>()
  const autoCloseRef = useRef<NodeJS.Timeout | null>(null)
  const ignoreNextOpenRef = useRef(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const isTriggerVisible = () => {
    try {
      if (!triggerRef.current) return false
      // element is visible if it has non-zero bounding rect and is in the document flow
      const rect = triggerRef.current.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    } catch (e) {
      return false
    }
  }

  const pathname = usePathname()
  const previousTotalItems = useRef(cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0)
  const mounted = useRef(false)

  const totalItems = cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  const total = cartState?.total ?? 0

  const openDropdown = () => setCartDropdownOpen(true)
  const closeDropdown = () => setCartDropdownOpen(false)

  // Opens dropdown and sets a timer to auto-close it after 5 seconds
  const openWithTimeout = () => {
    // Only open if the trigger is currently visible (prevents duplicate popovers
    // when desktop and mobile instances both exist in DOM)
    if (!isTriggerVisible()) return
    openDropdown()
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    autoCloseRef.current = setTimeout(closeDropdown, 5000)
  }

  const scheduleCloseShort = () => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    autoCloseRef.current = setTimeout(() => setCartDropdownOpen(false), 200)
  }

  // Opens dropdown and clears any existing auto-close timer
  const openAndClearTimeout = () => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    if (!isTriggerVisible()) return
    openDropdown()
  }

  // Cleanup timer on unmount or timer change
  useEffect(() => {
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    }
  }, [])

  // Automatically open dropdown when total items change (except on /cart page)
  useEffect(() => {
    if (mounted.current) {
      // If a deletion originated from inside the dropdown we may want to
      // suppress the automatic re-open triggered by the totalItems change.
      if (ignoreNextOpenRef.current) {
        ignoreNextOpenRef.current = false
        // sync previousTotalItems and skip opening
        previousTotalItems.current = totalItems
        return
      }

      if (previousTotalItems.current !== totalItems && !pathname.includes("/cart")) {
        openWithTimeout()
      }
    } else {
      mounted.current = true
    }
    previousTotalItems.current = totalItems
  }, [totalItems, pathname])

  // Open on global event (from AddToCartButton)
  useEffect(() => {
    const handler = () => {
      if (isTriggerVisible()) openWithTimeout()
    }
    window.addEventListener("open-cart-dropdown", handler)
    return () => window.removeEventListener("open-cart-dropdown", handler)
  }, [])

  // Compute a shipping amount that includes taxes when available.
  const shippingAmount = (() => {
    const cs: any = cartState
    if (!cs) return 0
    if (typeof cs?.shipping_total === "number") return cs.shipping_total
    if (typeof cs?.shipping_subtotal === "number") return cs.shipping_subtotal + (cs?.shipping_tax_total ?? 0)
    return cs?.shipping_methods?.at(-1)?.total ?? cs?.shipping_methods?.at(-1)?.amount ?? 0
  })()

  const router = useRouter()

  return (
    <Popover open={cartDropdownOpen} onOpenChange={setCartDropdownOpen}>
      <div className="relative flex items-center justify-center h-12 w-12 group">
          <PopoverTrigger asChild>
            <button
            aria-label="Warenkorb"
            className="flex items-center justify-center h-10 w-10 transition-colors text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => router.push('/cart')}
            onMouseEnter={openAndClearTimeout}
            onMouseLeave={scheduleCloseShort}
            onWheel={() => {
              if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
              setCartDropdownOpen(true)
            }}
            data-testid="nav-cart-link"
            style={{ background: 'none', boxShadow: 'none', border: 'none', padding: 0 }}
              ref={(el) => (triggerRef.current = el)}
          >
              <div className="relative">
              <ShoppingBagIcon className="w-7 h-7" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 badge-count" aria-live="polite">{totalItems}</span>
              )}
            </div>
          </button>
        </PopoverTrigger>
        {/* Dead zone below icon for hover forgiveness */}
        <div className="absolute left-0 right-0 -bottom-3 h-3 z-10" />
      </div>
  <PopoverContent
        align="end"
        className="p-0 w-[420px] bg-white border shadow-lg hidden md:block backdrop-blur-sm"
        data-testid="nav-cart-dropdown"
  onMouseEnter={openAndClearTimeout}
  onMouseLeave={scheduleCloseShort}
  onWheel={() => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current)
    setCartDropdownOpen(true)
  }}
      >
          <div className="p-4 flex items-center justify-between border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            Warenkorb
          </h3>
        </div>

        {cartState && cartState.items?.length ? (
          <>
            <div className="overflow-y-auto max-h-[400px] search-dropdown-scroll scrollbar-thin">
              <div className="p-4 space-y-4">
                {cartState.items
                  .slice()
                  .sort((a, b) => (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1)
                  .map((item) => (
                    // make this a hover group so the delete button can use group-hover
                    <div key={item.id} className="flex gap-3 group relative">
                      <LocalizedClientLink href={`/products/${item.product_handle}`} className="flex-shrink-0 w-24">
                        <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                          <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
                        </div>
                      </LocalizedClientLink>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1 mr-2">
                            <h4 className="text-sm font-medium truncate">
                              <LocalizedClientLink href={`/products/${item.product_handle}`} data-testid="product-link" className="hover:text-primary">
                                {item.title}
                              </LocalizedClientLink>
                            </h4>
                            <LineItemOptions variant={item.variant} data-testid="cart-item-variant" data-value={item.variant} />
                            <div className="text-xs text-muted-foreground mt-1">Anzahl: {item.quantity}</div>
                          </div>

                          <div className="flex items-start justify-end">
                            <LineItemPrice item={item} style="tight" currencyCode={cartState.currency_code} />
                          </div>
                        </div>

                        <div className="mt-2" />
                      </div>

                      {/* delete button positioned outside the thumbnail at bottom-right of the item */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <DeleteButton
                          id={item.id}
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid="cart-item-remove-button"
                          onDeleted={(_updatedCart) => {
                            // Prevent the automatic re-open triggered by the items count change
                            ignoreNextOpenRef.current = true
                            // Close the dropdown after deletion to avoid PopoverContent losing its trigger
                            setCartDropdownOpen(false)
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t space-y-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Versand (ausgewählt)</span>
                    <span className="text-sm" data-testid="cart-shipping" data-value={shippingAmount}>
                      {convertToLocale({ amount: shippingAmount, currency_code: cartState.currency_code })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Zwischensumme <span className="font-normal">(inkl. MwSt)</span></span>
                    <span className="text-large-semi" data-testid="cart-subtotal" data-value={total}>
                      {convertToLocale({ amount: total, currency_code: cartState.currency_code })}
                    </span>
                  </div>

                  <LocalizedClientLink href="/cart" className="block">
                    <Button className="w-full" variant="outline" data-testid="go-to-cart-button">Zum Warenkorb</Button>
                  </LocalizedClientLink>
                </div>
            </div>
          </>
        ) : (
          <div className="flex py-16 flex-col gap-4 items-center justify-center text-center px-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Ihr Warenkorb ist leer</h4>
              <p className="text-sm text-muted-foreground">Legen Sie Artikel in den Warenkorb</p>
            </div>

            <LocalizedClientLink href="/store">
              <Button className="w-full" variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Produkte entdecken
              </Button>
            </LocalizedClientLink>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default CartDropdown

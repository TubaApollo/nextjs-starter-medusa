"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { FaShoppingCart } from "react-icons/fa"

type CartDropdownProps = {
  cart?: HttpTypes.StoreCart | null
}

const CartDropdown = ({ cart: cartState }: CartDropdownProps) => {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | undefined>()

  const pathname = usePathname()
  const previousTotalItems = useRef(cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0)
  const mounted = useRef(false)

  const totalItems = cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  const total = cartState?.total ?? 0

  const openDropdown = () => setCartDropdownOpen(true)
  const closeDropdown = () => setCartDropdownOpen(false)

  // Opens dropdown and sets a timer to auto-close it after 5 seconds
  const openWithTimeout = () => {
    openDropdown()
    const timer = setTimeout(closeDropdown, 5000)
    setAutoCloseTimer(timer)
  }

  // Opens dropdown and clears any existing auto-close timer
  const openAndClearTimeout = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
    openDropdown()
  }

  // Cleanup timer on unmount or timer change
  useEffect(() => {
    return () => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer)
    }
  }, [autoCloseTimer])

  // Automatically open dropdown when total items change (except on /cart page)
  useEffect(() => {
    if (mounted.current) {
      if (previousTotalItems.current !== totalItems && !pathname.includes("/cart")) {
        openWithTimeout()
      }
    } else {
      mounted.current = true
    }
    previousTotalItems.current = totalItems
  }, [totalItems, pathname])

  return (
    <div className="h-full" onMouseEnter={openAndClearTimeout} onMouseLeave={closeDropdown}>
      <Popover className="relative h-full">
        <PopoverButton className="relative flex items-center h-full" aria-label="Cart">
          <LocalizedClientLink
            href="/cart"
            data-testid="nav-cart-link"
            className="flex items-center hover:text-ui-fg-base relative"
            tabIndex={-1}
          >
            <FaShoppingCart size={22} />
            {totalItems > 0 && (
              <span
                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-red-600 text-white text-xs font-semibold h-4 w-4 rounded-full"
                aria-live="polite"
              >
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base rounded-b-xl"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Warenkorb</h3>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .slice() // create a shallow copy before sorting
                    .sort((a, b) =>
                      (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    )
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>

                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Anzahl: {item.quantity}
                                </span>
                              </div>

                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>

                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Entfernen
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold">
                      Zwischensumme <span className="font-normal">(inkl. MwSt)</span>
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={total}
                    >
                      {convertToLocale({
                        amount: total,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Zum Warenkorb
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                  <span>0</span>
                </div>

                <span>Ihr Warenkorb ist leer.</span>

                <LocalizedClientLink href="/store">
                  <Button onClick={closeDropdown}>Produkte entdecken</Button>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown

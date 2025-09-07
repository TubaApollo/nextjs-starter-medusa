"use client"

import React, { Fragment, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDownIcon, 
  CheckIcon, 
  TruckIcon, 
  CreditCardIcon, 
  PhoneIcon, 
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ScaleIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline"
import ReactCountryFlag from "react-country-flag"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"

type CountryOption = {
  country: string
  region: string
  label: string
}

interface TopBarProps {
  regions: HttpTypes.StoreRegion[] | null
  className?: string
}

const TopBar = ({ regions, className }: TopBarProps) => {
  const [current, setCurrent] = useState<CountryOption | null>(null)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      if (option && option.country && option.label) {
        setCurrent({
          country: option.country,
          region: option.region,
          label: option.label
        })
      } else {
        setCurrent(null)
      }
    }
  }, [options, countryCode])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  const handleCountryChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
  }

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setIsLanguageOpen(true)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsLanguageOpen(false)
    }, 150) // Reduced delay for faster response
    setHoverTimeout(timeout)
  }

  const topBarItems = [
    {
      icon: TruckIcon,
      text: "KOSTENLOSER VERSAND AB 100€",
      href: "/shipping"
    },
    {
      icon: CreditCardIcon,
      text: "RECHNUNGSKAUF MÖGLICH",
      href: "/payment"
    },
    {
      icon: PhoneIcon,
      text: "TELEFONISCHE BERATUNG",
      href: "/contact"
    },
    {
      icon: BuildingStorefrontIcon,
      text: "ANGEBOTSSERVICE",
      href: "/quotes"
    }
  ]

  const rightItems = [
    {
      icon: ChatBubbleLeftRightIcon,
      text: "BLOG",
      href: "/blog"
    },
    {
      icon: HeartIcon,
      text: "WUNSCHLISTE",
      href: "/wishlist"
    },
    {
      icon: ScaleIcon,
      text: "VERGLEICHEN",
      href: "/compare"
    }
  ]

  return (
    <motion.div 
      className={`bg-slate-900 text-white text-xs border-b border-slate-800 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-8 sm:h-10">
          {/* Mobile - Show only shipping info */}
          <div className="lg:hidden flex-1 flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="text-xs font-medium flex items-center space-x-1.5"
            >
              <TruckIcon className="w-3.5 h-3.5" />
              <span className="hidden 2xsmall:inline">KOSTENLOSER VERSAND AB 100€</span>
              <span className="2xsmall:hidden">VERSANDKOSTENFREI</span>
            </motion.div>
          </div>

          {/* Desktop - Service items */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {topBarItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <LocalizedClientLink
                  href={item.href}
                  className="flex items-center space-x-1.5 transition-all duration-200 ease-out group hover:text-red-400"
                >
                  <div className="w-3.5 h-3.5 transition-all duration-200 ease-out group-hover:scale-110 group-hover:text-red-400">
                    {React.createElement(item.icon, {
                      className: "w-3.5 h-3.5"
                    })}
                  </div>
                  <span className="font-medium text-[10px] xl:text-xs transition-all duration-200 ease-out group-hover:text-red-400">{item.text}</span>
                </LocalizedClientLink>
              </motion.div>
            ))}
          </div>

          {/* Right side - Quick links and Language selector */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Quick links - hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {rightItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + topBarItems.length) * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <LocalizedClientLink
                    href={item.href}
                    className="flex items-center space-x-1 transition-all duration-200 ease-out group hover:text-red-400"
                  >
                    <div className="w-3.5 h-3.5 transition-all duration-200 ease-out group-hover:scale-110 group-hover:text-red-400">
                      {React.createElement(item.icon, {
                        className: "w-3.5 h-3.5"
                      })}
                    </div>
                    <span className="font-medium text-[10px] lg:text-xs transition-all duration-200 ease-out group-hover:text-red-400">{item.text}</span>
                  </LocalizedClientLink>
                </motion.div>
              ))}
            </div>

            {/* Separator */}
            <motion.div 
              className="hidden md:block w-px h-3 sm:h-4 bg-slate-700"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.7, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Language Selector */}
            {regions && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative">
                  {/* Custom Button */}
                  <div 
                    className={`flex items-center space-x-1 sm:space-x-2 group py-1 px-1 sm:px-2 rounded-md cursor-pointer transition-all duration-200 ease-out ${
                      isLanguageOpen 
                        ? "text-red-400 bg-red-50/20" 
                        : "text-white hover:text-red-400 hover:bg-red-50/10"
                    }`}
                  >
                    <div className="transition-all duration-200 ease-out group-hover:scale-110">
                      <GlobeAltIcon className="w-3 sm:w-4 h-3 sm:h-4" />
                    </div>
                    {current && (
                      <div className="flex items-center space-x-1">
                        <ReactCountryFlag
                          svg
                          style={{
                            width: "14px",
                            height: "14px",
                          }}
                          countryCode={current.country ?? ""}
                        />
                        <span className="font-medium text-[10px] sm:text-xs hidden sm:inline">
                          {current.label}
                        </span>
                      </div>
                    )}
                    <motion.div
                      animate={{ rotate: isLanguageOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <ChevronDownIcon className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                    </motion.div>
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isLanguageOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 top-full mt-1 w-40 sm:w-48 max-h-60 overflow-auto bg-white rounded-lg shadow-2xl border border-gray-200 py-2 text-black z-[9999]"
                      >
                        {options?.map((option, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02, duration: 0.2 }}
                            whileHover={{ 
                              backgroundColor: "rgb(254 242 242)", 
                              transition: { duration: 0.1 } 
                            }}
                            className={`relative cursor-pointer select-none py-2.5 px-3 text-sm rounded-md mx-1 mb-1 transition-all duration-150 ${
                              current?.country === option?.country 
                                ? "bg-red-50 text-red-900 border border-red-200" 
                                : "text-gray-900 hover:text-red-900"
                            }`}
                            onClick={() => {
                              if (option && option.country && option.label) {
                                handleCountryChange({
                                  country: option.country,
                                  region: option.region,
                                  label: option.label
                                })
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <ReactCountryFlag
                                  svg
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                  }}
                                  countryCode={option?.country ?? ""}
                                />
                                <span className={`font-medium text-xs sm:text-sm ${
                                  current?.country === option?.country ? "text-red-900" : ""
                                }`}>
                                  {option?.label}
                                </span>
                              </div>
                              {current?.country === option?.country && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                >
                                  <CheckIcon className="w-4 h-4 text-red-600" />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TopBar

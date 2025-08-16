"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import CountrySelect from "@modules/layout/components/country-select"
import { ArrowRightMini } from "@medusajs/icons"
import useToggleState from "@lib/hooks/use-toggle-state"

interface FooterRegionSelectorProps {
  regions: HttpTypes.StoreRegion[] | null
}

export default function FooterRegionSelector({ regions }: FooterRegionSelectorProps) {
  const toggleState = useToggleState()

  return (
    <div className="mb-6">
      <div
        className={clx(
          "inline-flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-xl border w-full max-w-[220px] sm:max-w-[240px]",
          "bg-white/60 backdrop-blur-sm border-gray-200",
          "cursor-pointer transition-all duration-200 ease-out",
          "hover:bg-white/75 hover:backdrop-blur-md hover:shadow-md",
          "hover:border-gray-250",
          "text-sm sm:text-base",
          toggleState.state && "bg-white/75 backdrop-blur-md shadow-md",
          "overflow-visible"
        )}
        onMouseEnter={toggleState.open}
        onMouseLeave={toggleState.close}
      >
        {regions && (
          <div className="flex-grow min-w-0">
            <CountrySelect toggleState={toggleState} regions={regions} />
          </div>
        )}
        <ArrowRightMini
          className={clx(
            "w-4 h-4 text-gray-700 transition-transform duration-200 ease-out",
            toggleState.state ? "-rotate-90" : "rotate-0"
          )}
          style={{ flexShrink: 0 }}
        />
      </div>
    </div>
  )
}

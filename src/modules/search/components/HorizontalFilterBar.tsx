"use client"

import React, { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { useRefinementList, ClearRefinements, RangeInput } from "react-instantsearch"

type FilterPopoverProps = {
  attribute: string
  label: string
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ attribute, label }) => {
  const { items, refine } = useRefinementList({ 
    attribute, 
    limit: 10, 
    showMore: false
  })

  const selectedCount = items ? items.filter(item => item.isRefined).length : 0

  if (!items || items.length === 0) return null

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`group inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              open || selectedCount > 0
                ? "bg-gray-900 text-white shadow-md" 
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <span>{label}</span>
            {selectedCount > 0 && (
              <span className="ml-1 rounded-full bg-gray-100 text-gray-900 px-2 py-0.5 text-xs font-semibold">
                {selectedCount}
              </span>
            )}
            <ChevronDownIcon 
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} 
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-95"
          >
            <Popover.Panel className="absolute z-50 mt-3 w-80 rounded-xl border border-gray-200 bg-white shadow-xl focus:outline-none">
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{label}</span>
                  <ClearRefinements
                    includedAttributes={[attribute]}
                    translations={{ resetButtonText: "Zurücksetzen" }}
                    classNames={{ 
                      button: "text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium",
                      disabledButton: "text-xs text-gray-300"
                    }}
                  />
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {items.map((item) => (
                    <label 
                      key={item.value}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.isRefined}
                        onChange={() => refine(item.value)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-800 focus:ring-2"
                      />
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

const PriceFilterPopover: React.FC = () => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`group inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              open
                ? "bg-gray-900 text-white shadow-md" 
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <span>Preis</span>
            <ChevronDownIcon 
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`} 
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-95"
          >
            <Popover.Panel className="absolute z-50 mt-3 w-80 rounded-xl border border-gray-200 bg-white shadow-xl focus:outline-none">
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Preisbereich</span>
                  <ClearRefinements
                    includedAttributes={["min_price"]}
                    translations={{ resetButtonText: "Zurücksetzen" }}
                    classNames={{ 
                      button: "text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium",
                      disabledButton: "text-xs text-gray-300"
                    }}
                  />
                </div>
                
                <RangeInput
                  attribute="min_price"
                  min={0}
                  precision={0}
                  classNames={{
                    root: "space-y-4",
                    form: "flex items-center gap-3",
                    input: "w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-sm",
                    separator: "text-gray-500 font-medium",
                    submit: "px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black transition-colors font-medium",
                  }}
                />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

type HorizontalFilterBarProps = {
  categoryMap?: Record<string, string>
}

const HorizontalFilterBar: React.FC<HorizontalFilterBarProps> = ({ categoryMap = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Icon and Label */}
        <div className="mr-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <span>Produktfilter</span>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterPopover attribute="categories" label="Kategorien" />
          <FilterPopover attribute="tags" label="Tags" />
          <FilterPopover attribute="type" label="Typ" />
          <FilterPopover attribute="collection_title" label="Kollektion" />
          <PriceFilterPopover />
        </div>

        {/* Clear All Button */}
        <div className="ml-auto">
          <ClearRefinements
            translations={{ resetButtonText: "Alle Filter zurücksetzen" }}
            classNames={{ 
              button: "text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100",
              disabledButton: "text-sm text-gray-400 px-3 py-1.5"
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default HorizontalFilterBar

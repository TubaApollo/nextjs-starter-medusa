"use client"

import React from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { cn } from "@lib/lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@lib/components/ui/button"

const steps = [
  { key: "address", label: "Adresse" },
  { key: "delivery", label: "Lieferung" },
  { key: "payment", label: "Zahlung" },
  { key: "review", label: "Überprüfung" },
]

export default function CheckoutSteps() {
  const search = useSearchParams()
  const pathname = usePathname() || ""
  const current = search.get("step") || "address"

  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === current)
  )

  return (
    <nav aria-label="Checkout steps" className="mb-6">
      <ol className="flex flex-col md:flex-row items-stretch gap-3">
        {steps.map((s, i) => {
          const completed = i < currentIndex
          const active = i === currentIndex

          return (
            <li key={s.key} className="flex-1">
              <LocalizedClientLink href={`${pathname}?step=${s.key}`}>
                <Button
                  aria-current={active ? "step" : undefined}
                  variant={completed ? "default" : active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full h-auto flex items-center gap-4 justify-start py-3 px-4 min-h-[48px] rounded-lg transition-colors duration-150",
                    {
                      // remove shadow for a cleaner look; keep subtle border for idle state
                      "border border-slate-200": !active && !completed,
                    }
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full text-base font-semibold shrink-0",
                      completed ? "bg-white text-primary" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center justify-center w-full h-full">
                      {i + 1}
                    </span>
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm md:text-base font-semibold">{s.label}</span>
                    {/* optional subtitle slot in future */}
                  </div>
                </Button>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

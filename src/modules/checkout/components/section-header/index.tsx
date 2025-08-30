"use client"

import React from "react"
import { cn } from "@lib/lib/utils"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

type Props = {
  title: string
  index?: number
  isOpen?: boolean
  completed?: boolean
  className?: string
}

export default function SectionHeader({ title, index, isOpen, completed, className }: Props) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {typeof index === "number" ? (
        <div
          className={cn(
            "relative w-9 h-9 rounded-full font-semibold leading-none",
            completed ? "bg-primary text-white" : isOpen ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {completed && !isOpen ? (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <CheckCircleIcon className="w-5 h-5 text-white block" />
            </span>
          ) : (
            <span className="grid place-items-center w-full h-full">{index}</span>
          )}
        </div>
      ) : null}

      <h2 className={cn("text-2xl font-semibold", isOpen ? "text-ui-fg-base" : "text-ui-fg-base/90")}>{title}</h2>
    </div>
  )
}

"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { Input } from "@lib/components/ui/input"
import { Button } from "@lib/components/ui/button"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="grid sm:grid-cols-2 items-center gap-x-8 gap-y-4 w-full">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-lg">Bestellübertragung</h3>
          <p className="text-base-regular text-muted-foreground">
            Finden Sie die Bestellung nicht? Verbinden Sie eine Bestellung mit Ihrem Konto.
          </p>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Input className="w-full" name="order_id" placeholder="Bestell-ID" />
            <SubmitButton
              variant="secondary"
              className="w-fit whitespace-nowrap self-end"
            >
              Übertragung anfordern
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <p className="text-base-regular text-rose-500 text-right">
          {state.error}
        </p>
      )}
      {showSuccess && (
        <div className="flex justify-between p-4 bg-muted shadow-sm w-full self-stretch items-center rounded-md">
          <div className="flex gap-x-2 items-center">
            <CheckCircleMiniSolid className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col gap-y-1">
              <span className="text-base-semi">
                Übertragung für Bestellung {state.order?.id} angefordert
              </span>
              <span className="text-base-regular text-muted-foreground">
                Bestätigungs-E-Mail gesendet an {state.order?.email}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-fit" onClick={() => setShowSuccess(false)}>
            <XCircleSolid className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  )
}

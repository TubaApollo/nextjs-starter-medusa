"use client"

import { Badge } from "@lib/components/ui/badge"
import { Button } from "@lib/components/ui/button"
import { Input } from "@lib/components/ui/input"
import { Label } from "@lib/components/ui/label"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { motion, AnimatePresence } from "framer-motion"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [errorMessage, setErrorMessage] = React.useState("")
  const [success, setSuccess] = React.useState<string | null>(null)

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    try {
      await applyPromotions(
        validPromotions
          .filter((p) => !p.is_automatic && p.code)
          .map((p) => p.code as string)
      )
    } catch (e: any) {
      setErrorMessage(e.message)
    }
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => !p.is_automatic && p.code)
      .map((p) => p.code as string)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
      setSuccess(code.toString())
      setTimeout(() => setSuccess(null), 1800)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full space-y-4">
      <div>
        <Label htmlFor="promotion-input" className="text-base font-medium">
          Gutscheincode
        </Label>
        <form action={(a) => addPromotionCode(a)} className="flex gap-2 mt-2">
          <Input
            id="promotion-input"
            name="code"
            type="text"
            placeholder="Gutscheincode eingeben"
            className="flex-1"
            data-testid="discount-input"
          />
          <Button
            type="submit"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            data-testid="discount-apply-button"
          >
            Anwenden
          </Button>
        </form>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-green-600 text-sm"
            >
              Code „{success}“ angewendet.
            </motion.div>
          )}
        </AnimatePresence>

        <ErrorMessage
          error={errorMessage}
          data-testid="discount-error-message"
        />
      </div>

      {promotions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-base font-medium">Aktive Promotion(s):</Label>
          <div className="space-y-2">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                data-testid="discount-row"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={promotion.is_automatic ? "default" : "secondary"}
                    className={promotion.is_automatic ? "bg-green-100 text-green-800" : ""}
                  >
                    {promotion.code}
                  </Badge>
                  {promotion.application_method?.value !== undefined &&
                    promotion.application_method.currency_code !== undefined && (
                      <span className="text-sm text-gray-600">
                        (
                        {promotion.application_method.type === "percentage"
                          ? `${promotion.application_method.value}%`
                          : convertToLocale({
                              amount: Number(promotion.application_method.value ?? 0),
                              currency_code: promotion.application_method.currency_code,
                            })}
                        )
                      </span>
                    )}
                </div>
                {!promotion.is_automatic && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!promotion.code) return
                      removePromotionCode(promotion.code)
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    data-testid="remove-discount-button"
                  >
                    <Trash size={14} />
                    <span className="sr-only">Rabattcode entfernen</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode

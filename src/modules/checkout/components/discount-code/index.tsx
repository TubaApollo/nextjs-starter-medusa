"use client"

import { Badge, Heading, Input, Text, Button } from "@medusajs/ui"
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
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        <Heading level="h3" className="text-base mb-2">Gutscheincode</Heading>
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
          <div className="flex w-full gap-x-2">
            <Input
              className="size-full"
              id="promotion-input"
              name="code"
              type="text"
              placeholder="Gutscheincode eingeben"
              autoFocus={false}
              data-testid="discount-input"
            />
            <Button type="submit" variant="secondary" data-testid="discount-apply-button">
              Code anwenden
            </Button>
          </div>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-2 text-green-700 text-sm"
              >
                Code „{success}“ angewendet.
              </motion.div>
            )}
          </AnimatePresence>

          <ErrorMessage
            error={errorMessage}
            data-testid="discount-error-message"
          />
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">Aktive Promotion(s):</Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount: Number(promotion.application_method.value ?? 0),
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Rabattcode entfernen
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode

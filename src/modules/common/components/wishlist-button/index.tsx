"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { useWishlist } from "@lib/context/wishlist-context"
import { Button } from "@lib/components/ui/button"
import { cn } from "@lib/lib/utils"

interface WishlistButtonProps {
  variantId: string
  productHandle?: string
  className?: string
  iconClassName?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
}

export default function WishlistButton({
  variantId,
  productHandle,
  className,
  iconClassName,
  showText = true,
  size = "md",
  variant = "ghost"
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist, wishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Update local state when wishlist changes
  useEffect(() => {
    setIsWishlisted(isInWishlist(variantId))
  }, [wishlist, variantId, isInWishlist])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return

    setIsLoading(true)
    try {
      const success = await toggleItem(variantId)
      if (success) {
        setIsWishlisted(!isWishlisted)
      }
    } catch (error) {
      console.error("Failed to toggle wishlist item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeMap = {
    sm: { button: "sm", icon: "h-3 w-3" },
    md: { button: "sm", icon: "h-4 w-4" },
    lg: { button: "default", icon: "h-5 w-5" }
  } as const

  return (
    <Button
      type="button"
      variant={variant}
      size={sizeMap[size].button}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "gap-2 transition-colors",
        isWishlisted && "text-red-500 hover:text-red-600 hover:bg-red-50",
        className
      )}
      aria-label={isWishlisted ? "Von Merkliste entfernen" : "Zu Merkliste hinzufügen"}
    >
      {isLoading ? (
        <Loader2 className={cn("animate-spin", sizeMap[size].icon)} />
      ) : (
        <Heart 
          className={cn(
            sizeMap[size].icon,
            iconClassName,
            isWishlisted && "fill-current"
          )} 
        /> 
      )}
      {showText && (
        <span className="hidden sm:inline">
          {isWishlisted ? "Gemerkt" : "Merken"}
        </span>
      )}
    </Button>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { useWishlist } from "@lib/context/wishlist-context"
import { cn } from "@lib/lib/utils"

interface WishlistButtonProps {
  variantId: string
  productHandle?: string
  className?: string
  iconClassName?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export default function WishlistButton({
  variantId,
  productHandle,
  className,
  iconClassName,
  showText = true,
  size = "md"
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist, wishlist, isAuthenticated } = useWishlist()
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

    // If user is not authenticated, the toggleItem will handle the redirect
    setIsLoading(true)
    try {
      console.log(`Toggling wishlist for variant ${variantId}, currently wishlisted: ${isWishlisted}`)
      const success = await toggleItem(variantId)
      
      if (success) {
        // Optimistically update local state
        setIsWishlisted(!isWishlisted)
        console.log(`Successfully toggled wishlist, new state: ${!isWishlisted}`)
      }
    } catch (error) {
      console.error("Failed to toggle wishlist item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "inline-flex items-center gap-2 hover:text-ui-fg-base transition-colors",
        isWishlisted && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={isWishlisted ? "Von Merkliste entfernen" : "Zu Merkliste hinzufügen"}
    >
      {isLoading ? (
        <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size])} />
      ) : (
        <Heart 
          className={cn(
            sizeClasses[size], 
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
    </button>
  )
}

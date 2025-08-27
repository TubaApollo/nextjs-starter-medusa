"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { Wishlist, addWishlistItem, removeWishlistItem, retrieveWishlist, createWishlist } from "@lib/data/wishlist"
import { useCustomer } from "./customer-context"

interface WishlistContextType {
  wishlist: Wishlist | null
  isLoading: boolean
  isAuthenticated: boolean
  addItem: (variantId: string) => Promise<boolean>
  removeItem: (itemId: string) => Promise<boolean>
  toggleItem: (variantId: string) => Promise<boolean>
  isInWishlist: (variantId: string) => boolean
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === null) {
    throw new Error("useWishlist muss innerhalb eines WishlistProvider verwendet werden")
  }
  return context
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { customer, isLoading: customerLoading, isAuthenticated } = useCustomer()

  const loadWishlist = useCallback(async () => {
    if (!customer) {
      console.log("🧹 Kunde nicht authentifiziert, lösche Wunschliste.")
      setWishlist(null)
      return
    }

    console.log("🔍 Kunde ist authentifiziert, lade Wunschliste...")
    setIsLoading(true)
    try {
      const fetchedWishlist = await retrieveWishlist()
      if (fetchedWishlist) {
        console.log("✅ Wunschliste erfolgreich abgerufen:", fetchedWishlist)
        setWishlist(fetchedWishlist)
      } else {
        console.log("📝 Keine Wunschliste gefunden, erstelle eine neue...")
        const newWishlist = await createWishlist()
        if (newWishlist) {
          console.log("✅ Neue Wunschliste erfolgreich erstellt:", newWishlist)
          setWishlist(newWishlist)
        } else {
          console.log("⚠️ Konnte keine Wunschliste erstellen")
          setWishlist(null)
        }
      }
    } catch (error) {
      console.error("❌ Fehler beim Laden der Wunschliste:", error)
      setWishlist(null)
    } finally {
      setIsLoading(false)
      console.log("✅ Ladevorgang der Wunschliste abgeschlossen.")
    }
  }, [customer])

  useEffect(() => {
    // Only load wishlist when customer loading is complete
    if (!customerLoading) {
      loadWishlist()
    }
  }, [customer, customerLoading, loadWishlist])

  // Also listen for auth change events to reload wishlist
  useEffect(() => {
    const handleAuthChange = () => {
      if (!customerLoading) {
        loadWishlist()
      }
    }

    const handleLogout = () => {
      console.log("🚪 Logout event received, clearing wishlist")
      setWishlist(null)
      setIsLoading(false)
    }

    window.addEventListener("auth-changed", handleAuthChange)
    window.addEventListener("auth-logout", handleLogout)
    
    return () => {
      window.removeEventListener("auth-changed", handleAuthChange)
      window.removeEventListener("auth-logout", handleLogout)
    }
  }, [customerLoading, loadWishlist])

  const addItem = useCallback(async (variantId: string): Promise<boolean> => {
    if (!customer) {
      console.log("❌ Benutzer nicht authentifiziert. Kann nicht zur Wunschliste hinzufügen.")
      window.dispatchEvent(
        new CustomEvent("auth-required-for-wishlist", {
          detail: {
            title: "Anmeldung erforderlich",
            message:
              "Sie müssen angemeldet sein, um Artikel zu Ihrer Merkliste hinzuzufügen.",
          },
        })
      )
      return false
    }
    
    try {
      const result = await addWishlistItem(variantId)
      if (result.wishlist) {
        setWishlist(result.wishlist)
        window.dispatchEvent(new CustomEvent("open-wishlist-dropdown"))
        return true
      } else {
        console.warn("⚠️ Artikel wurde möglicherweise nicht zur Wunschliste hinzugefügt")
        // Reload wishlist to get current state
        await loadWishlist()
        return false
      }
    } catch (error) {
      console.error("❌ Fehler beim Hinzufügen des Artikels zur Wunschliste:", error)
      // Check if this is an auth error and refresh customer state
      if (error instanceof Error && error.message.includes('401')) {
        console.log("🔄 Auth-Fehler erkannt, aktualisiere Kundenstatus...")
        window.dispatchEvent(new CustomEvent("auth-changed"))
      }
      return false
    }
  }, [customer, loadWishlist])

  const removeItem = useCallback(async (itemId: string): Promise<boolean> => {
    if (!customer) {
      console.log("❌ Benutzer nicht authentifiziert. Kann nicht von Wunschliste entfernen.")
      return false
    }
    
    try {
      const success = await removeWishlistItem(itemId)
      if (success) {
        setWishlist(prev => prev ? { ...prev, items: prev.items.filter(item => item.id !== itemId) } : null)
        return true
      } else {
        console.warn("⚠️ Artikel wurde möglicherweise nicht von der Wunschliste entfernt")
        // Reload wishlist to get current state
        await loadWishlist()
        return false
      }
    } catch (error) {
      console.error("❌ Fehler beim Entfernen des Artikels von der Wunschliste:", error)
      // Check if this is an auth error and refresh customer state
      if (error instanceof Error && error.message.includes('401')) {
        console.log("🔄 Auth-Fehler erkannt, aktualisiere Kundenstatus...")
        window.dispatchEvent(new CustomEvent("auth-changed"))
      }
      return false
    }
  }, [customer, loadWishlist])

  const toggleItem = useCallback(async (variantId: string): Promise<boolean> => {
    const existingItem = wishlist?.items.find(item => item.product_variant_id === variantId)
    if (existingItem) {
      return await removeItem(existingItem.id)
    } else {
      return await addItem(variantId)
    }
  }, [wishlist, addItem, removeItem])

  const isInWishlist = useCallback((variantId: string) => {
    return wishlist?.items.some(item => item.product_variant_id === variantId) ?? false
  }, [wishlist])

  const totalItems = wishlist?.items.length ?? 0

  const value: WishlistContextType = {
    wishlist,
    isLoading,
    isAuthenticated,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    totalItems,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

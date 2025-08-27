"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { HttpTypes } from "@medusajs/types"
import { retrieveCustomer } from "@lib/data/customer"

interface CustomerContextType {
  customer: HttpTypes.StoreCustomer | null
  isLoading: boolean
  isAuthenticated: boolean
  refresh: () => Promise<void>
}

const CustomerContext = createContext<CustomerContextType | null>(null)

export function useCustomer(): CustomerContextType {
  const ctx = useContext(CustomerContext)
  if (!ctx) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }
  return ctx
}

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      // Use the server action that properly handles JWT cookies
      const customerData = await retrieveCustomer()
      setCustomer(customerData)
    } catch (error) {
      console.error("Error retrieving customer:", error)
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // initial fetch
    refresh()

    // Listen to auth changes to revalidate
    const handleAuthChange = () => {
      refresh()
    }
    
    // Listen to login form submissions to refresh auth state
    const handleLoginSuccess = () => {
      // Delay refresh slightly to allow server state to update
      setTimeout(refresh, 100)
    }

    // Listen to logout events to immediately clear customer state
    const handleLogout = () => {
      console.log("🚪 Logout event received, clearing customer state")
      setCustomer(null)
      setIsLoading(false)
    }

    window.addEventListener("auth-changed", handleAuthChange as EventListener)
    window.addEventListener("auth-login", handleLoginSuccess as EventListener)
    window.addEventListener("auth-logout", handleLogout as EventListener)
    
    return () => {
      window.removeEventListener("auth-changed", handleAuthChange as EventListener)
      window.removeEventListener("auth-login", handleLoginSuccess as EventListener)
      window.removeEventListener("auth-logout", handleLogout as EventListener)
    }
  }, [refresh])

  const value: CustomerContextType = {
    customer,
    isLoading,
    isAuthenticated: !!customer,
    refresh,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}
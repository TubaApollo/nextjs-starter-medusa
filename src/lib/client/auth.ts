"use client"

import { login as serverLogin, signout as serverSignout, signoutWithoutRedirect } from "@lib/data/customer"
import { triggerAuthLogin, triggerAuthLogout } from "@lib/util/auth-events"
import { HttpTypes } from "@medusajs/types"

/**
 * Client-side wrapper for login that triggers auth state changes
 */
export async function loginWithAuthSync(formData: FormData): Promise<string | undefined> {
  const result = await serverLogin(null, formData)
  
  // If login was successful (no error string returned), trigger auth change
  if (typeof result !== "string") {
    triggerAuthLogin()
  }
  
  return result
}

/**
 * Client-side wrapper for logout that triggers auth state changes
 * Returns true if logout was successful, false otherwise
 */
export async function logoutWithAuthSync(): Promise<boolean> {
  try {
    // First trigger immediate logout event to clear client state
    triggerAuthLogout()
    
    // Then perform server-side logout (without redirect)
    await signoutWithoutRedirect()
    
    return true
  } catch (error) {
    console.error("Logout failed:", error)
    // Still trigger logout event to clear client state even if server logout fails
    triggerAuthLogout()
    
    return false
  }
}

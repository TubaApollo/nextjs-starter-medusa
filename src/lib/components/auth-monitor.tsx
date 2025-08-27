"use client"

import { useEffect } from "react"
import { triggerAuthLogin, triggerAuthLogout } from "@lib/util/auth-events"

/**
 * Auth Monitor Component
 * 
 * This component monitors for authentication-related events and triggers
 * the appropriate client-side state updates to synchronize with server-side auth.
 * 
 * Should be included in the layout to ensure auth events are properly handled.
 */
export function AuthMonitor() {
  useEffect(() => {
    // Monitor for successful form submissions that might indicate login/logout
    const handleFormSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement
      
      // Check if this is a login form
      if (target.getAttribute('data-auth-form') === 'login') {
        // Delay to allow server action to complete
        setTimeout(() => {
          triggerAuthLogin()
        }, 500)
      }
      
      // Check if this is a logout form
      if (target.getAttribute('data-auth-form') === 'logout') {
        setTimeout(() => {
          triggerAuthLogout()
        }, 100)
      }
    }

    // Monitor for logout button clicks
    const handleButtonClick = (event: Event) => {
      const target = event.target as HTMLElement
      
      // Check if this is a logout button
      if (target.getAttribute('data-testid') === 'logout-button' || 
          target.closest('[data-testid="logout-button"]')) {
        console.log("🚪 Logout button clicked, triggering logout event")
        // Trigger immediately for logout
        triggerAuthLogout()
      }
    }

    // Monitor for page navigations that might indicate successful auth changes
    const handlePageLoad = () => {
      // Check if we're on an authenticated page (like account dashboard)
      if (window.location.pathname.includes('/account') && 
          !window.location.pathname.includes('/account/login')) {
        // Trigger auth refresh to ensure customer context is up to date
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("auth-changed"))
        }, 100)
      }
    }

    document.addEventListener('submit', handleFormSubmit)
    document.addEventListener('click', handleButtonClick)
    window.addEventListener('load', handlePageLoad)
    
    // Also trigger on page navigation in SPAs
    window.addEventListener('popstate', handlePageLoad)
    
    return () => {
      document.removeEventListener('submit', handleFormSubmit)
      document.removeEventListener('click', handleButtonClick)
      window.removeEventListener('load', handlePageLoad)
      window.removeEventListener('popstate', handlePageLoad)
    }
  }, [])

  return null // This component doesn't render anything
}

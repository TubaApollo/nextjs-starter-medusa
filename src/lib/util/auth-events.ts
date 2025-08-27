/**
 * Utility functions for triggering authentication state changes
 * that synchronize server-side auth with client-side context
 */

export function triggerAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-changed"))
  }
}

export function triggerAuthLogin() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-changed"))
    window.dispatchEvent(new CustomEvent("auth-login"))
  }
}

export function triggerAuthLogout() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-changed"))
    window.dispatchEvent(new CustomEvent("auth-logout"))
  }
}

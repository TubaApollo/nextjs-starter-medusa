"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@lib/components/ui/alert"
import { Button } from "@lib/components/ui/button"

interface AuthNotification {
  title: string
  message: string
}

export default function AuthNotification() {
  const [notification, setNotification] = useState<AuthNotification | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleAuthRequired = (event: CustomEvent<AuthNotification>) => {
      setNotification(event.detail)
      // Auto-hide after 8 seconds
      setTimeout(() => setNotification(null), 8000)
    }

    window.addEventListener("auth-required-for-wishlist", handleAuthRequired as EventListener)
    
    return () => {
      window.removeEventListener("auth-required-for-wishlist", handleAuthRequired as EventListener)
    }
  }, [])

  return (
    <>
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <Alert className="border-orange-200 bg-orange-50">
            <LogIn className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">{notification.title}</AlertTitle>
            <AlertDescription className="text-orange-700 mb-3">
              {notification.message}
            </AlertDescription>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => router.push("/account")}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Anmelden
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNotification(null)}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Schließen
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </>
  )
}

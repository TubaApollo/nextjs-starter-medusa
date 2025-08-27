"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@lib/components/ui/alert"
import { Button } from "@lib/components/ui/button"
import { LogIn, X } from "lucide-react"

interface AuthNotificationData {
  title: string
  message: string
}

export default function AuthNotification() {
  const [notification, setNotification] = useState<AuthNotificationData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleAuthRequired = (event: Event) => {
      const customEvent = event as CustomEvent<AuthNotificationData>
      setNotification(customEvent.detail)
      setIsVisible(true)
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 8000)
    }

    window.addEventListener("auth-required-for-wishlist", handleAuthRequired)
    
    return () => {
      window.removeEventListener("auth-required-for-wishlist", handleAuthRequired)
    }
  }, [])

  const handleLogin = () => {
    router.push("/account")
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible || !notification) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 animate-in slide-in-from-top-2">
      <Alert className="bg-yellow-50 border-yellow-200">
        <LogIn className="h-4 w-4 text-yellow-600" />
        <div className="flex items-start justify-between w-full">
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-1">{notification.title}</h4>
            <AlertDescription className="text-yellow-700 mb-3">
              {notification.message}
            </AlertDescription>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleLogin}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <LogIn className="w-3 h-3 mr-1" />
                Anmelden
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                Schließen
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClose}
            className="p-1 h-auto text-yellow-600 hover:bg-yellow-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}

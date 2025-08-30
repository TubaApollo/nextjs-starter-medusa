"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@lib/components/ui/alert-dialog"
import { Button } from "@lib/components/ui/button"

export default function DeleteAccount() {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/account/delete`, { method: "POST" })
      let parsed: any = null
      let textBody: string | null = null

      try {
        parsed = await res.json()
      } catch (e) {
        try {
          textBody = await res.text()
        } catch (__) {
          textBody = null
        }
      }

      if (res.ok && parsed?.success) {
        // navigate to account page after deletion
        router.push(`/${window.location.pathname.split('/')[1] || ''}/account`)
      } else {
        const statusInfo = `status=${res.status}`
        console.error('Delete failed', statusInfo, parsed ?? textBody)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      {/* Inline trigger only - explanatory text lives in the CardContent */}
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-shrink-0 text-destructive border-destructive bg-white/70 hover:bg-white hover:text-destructive"
        >
          Konto löschen
        </Button>
      </AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent className="sm:max-w-lg rounded-lg shadow-lg">
          <AlertDialogHeader className="text-center px-6 pt-6">
            <div className="mx-auto mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-destructive/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <AlertDialogTitle className="text-lg font-semibold">Account dauerhaft löschen</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Bestellungen und persönlichen Daten werden gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center gap-3 mt-6 px-6 pb-6">
            <AlertDialogCancel asChild>
              <Button variant="outline">Abbrechen</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? 'Lösche...' : 'Konto löschen'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  )
}

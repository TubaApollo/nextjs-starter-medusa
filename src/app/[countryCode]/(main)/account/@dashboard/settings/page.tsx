import ProfileName from "@modules/account/components/profile-name"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfilePhone from "@modules/account/components/profile-phone"
import ProfilePassword from "@modules/account/components/profile-password"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@lib/components/ui/card"
import { Button } from "@lib/components/ui/button"
import DeleteAccount from "@modules/account/components/delete-account"

export default async function SettingsPage() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kontoeinstellungen</h1>
        <div>
          <Button variant="ghost">Hilfe</Button>
        </div>
      </div>

          <div className="grid grid-cols-1 gap-6">

              <Card className="min-h-[120px]">
              <CardHeader className="flex items-center justify-between p-4">
                <CardTitle>Sicherheit</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilePassword customer={customer} />
              </CardContent>
            </Card>
            <Card className="min-h-[80px]">
              <CardHeader className="flex items-center p-4 pt-3 gap-4">
                <CardTitle className="flex-shrink-0">Gefahrenzone</CardTitle>
                <div className="flex items-center gap-3 w-full">
                  <div className="px-4 py-2 rounded-md border border-destructive bg-destructive/10 text-destructive text-sm ml-4">
                    Ihr Konto dauerhaft löschen. Diese Aktion kann nicht rückgängig gemacht werden.
                  </div>
                  <div className="flex-1" />
                  <DeleteAccount />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {/* Intentionally left blank - explanatory box moved to header */}
              </CardContent>
            </Card>
          </div>
    </div>
  )
}

export const metadata = {
  title: "Kontoeinstellungen",
  description: "Verwalten Sie Ihre Kontoeinstellungen.",
}

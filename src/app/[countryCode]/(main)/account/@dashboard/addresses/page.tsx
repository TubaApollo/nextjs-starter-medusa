import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"
import { Card, CardHeader, CardTitle, CardContent } from "@lib/components/ui/card"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Adressen",
  description: "Ihre Adressen anzeigen",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Lieferadressen</h1>
        <p className="text-base-regular">
          Sehen und bearbeiten Sie Ihre Lieferadressen. Sie können beliebig viele Adressen speichern, die beim Checkout zur Verfügung stehen.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ihre Adressen</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressBook customer={customer} region={region} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

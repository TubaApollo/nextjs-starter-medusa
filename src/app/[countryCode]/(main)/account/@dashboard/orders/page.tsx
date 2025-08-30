import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import { Card, CardHeader, CardTitle, CardContent } from "@lib/components/ui/card"

export const metadata: Metadata = {
  title: "Bestellungen",
  description: "Übersicht über Ihre bisherigen Bestellungen.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Bestellungen</h1>
        <p className="text-base-regular">
          Sehen Sie Ihre bisherigen Bestellungen und deren Status ein. Sie können auch Rücksendungen oder Umtausch für Ihre Bestellungen anfordern.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ihre Bestellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderOverview orders={orders} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bestellübertragung anfordern</CardTitle>
          </CardHeader>
          <CardContent>
            <TransferRequestForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

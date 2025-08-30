import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@lib/components/ui/card"
import { Button } from "@lib/components/ui/button"
import { Progress } from "@lib/components/ui/progress"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  // Show email confirmation banner for unconfirmed users
  const EmailConfirmationBanner = require("../email-confirmation-banner").default
  const completion = getProfileCompletion(customer)

  return (
    <div data-testid="overview-page-wrapper" className="space-y-6">
  {customer && <EmailConfirmationBanner customer={customer} />}
  <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Hallo {customer?.first_name}</h1>
          <p className="text-sm text-muted-foreground">Angemeldet als <span className="font-medium">{customer?.email}</span></p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" className="flex-shrink-0">Hilfe</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-4 mt-2 items-start">
        <Card className="min-h-[160px]">
          <CardHeader className="flex items-center justify-between p-4 pt-3">
            <CardTitle>Profil</CardTitle>
            <div>
              <LocalizedClientLink href="/account/profile">
                <Button variant="outline" size="sm">Profil bearbeiten</Button>
              </LocalizedClientLink>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-semibold">{completion}%</div>
                <div className="text-sm uppercase text-muted-foreground">Abgeschlossen</div>
              </div>

              <Progress value={completion} />

              <div className="text-sm text-muted-foreground">Vervollständigen Sie Ihr Profil, um ein besseres Erlebnis und personalisierte Empfehlungen zu erhalten.</div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">Tipp: Fügen Sie eine Rechnungsadresse hinzu, um schneller zur Kasse zu gehen.</div>
          </CardFooter>
        </Card>

        <Card className="min-h-[160px]">
          <CardHeader className="flex items-center justify-between p-4 pt-3">
            <CardTitle>Adressen</CardTitle>
            <div className="flex items-center gap-2">
              <LocalizedClientLink href="/account/addresses">
                <Button variant="outline" size="sm">Verwalten</Button>
              </LocalizedClientLink>
              <Button variant="ghost" size="sm"><ArrowDownTrayIcon className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div>
              <div className="text-2xl font-semibold">{customer?.addresses?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Gespeichert</div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[160px]">
          <CardHeader className="p-4 pt-3">
            <CardTitle>Letzte Bestellungen</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {orders && orders.length > 0 ? (
              <ul className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <li key={order.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 bg-gray-50 p-3 rounded">
                    <div className="text-sm">
                      <div className="font-medium">#{order.display_id}</div>
                      <div className="text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm font-semibold text-right">{convertToLocale({ amount: order.total, currency_code: order.currency_code })}</div>
                    <div className="text-right">
                      <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                        <Button variant="ghost" size="sm"><ArrowDownTrayIcon className="-rotate-90 w-4 h-4" /></Button>
                      </LocalizedClientLink>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">Keine Bestellungen</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return Math.round((count / 4) * 100)
}

export default Overview

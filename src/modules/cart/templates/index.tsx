import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@lib/components/ui/card"
import { Separator } from "@lib/components/ui/separator"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-12">
      <div className="content-container h-full max-w-6xl mx-auto" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] gap-x-10 gap-y-8">
            <main className="flex-1 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              {!customer && (
                <div className="mb-4">
                  <Card>
                    <CardContent className="py-6">
                      <SignInPrompt />
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <ItemsTemplate cart={cart} />
              </div>
            </main>

            <aside className="w-full">
              <div className="sticky top-12">
                {cart && cart.region && (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Zusammenfassung</h2>
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </aside>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <Card className="border border-muted-foreground/25 max-w-3xl mx-auto">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <EmptyCartMessage />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate

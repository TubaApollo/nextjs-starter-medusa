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
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] gap-x-10 gap-y-8">
            <div className="flex flex-col gap-y-6">
              {!customer && (
                <Card className="mb-2">
                  <CardContent className="py-6">
                    <SignInPrompt />
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Warenkorb</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  <ItemsTemplate cart={cart} />
                </CardContent>
              </Card>
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <Card className="mb-2">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Zusammenfassung</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                      <Summary cart={cart as any} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
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

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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-x-8 gap-y-8">
            <div className="space-y-6">
              {!customer && (
                <SignInPrompt />
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
            
            <div className="lg:sticky lg:top-12 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Zusammenfassung</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                  <Summary cart={cart as any} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-0">
              <EmptyCartMessage />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CartTemplate

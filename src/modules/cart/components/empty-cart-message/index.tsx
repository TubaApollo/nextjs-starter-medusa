import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@lib/components/ui/button"
import { CardTitle, CardDescription } from "@lib/components/ui/card"
import { ShoppingBag } from "lucide-react"

const EmptyCartMessage = () => {
  return (
    <>
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
      <CardTitle className="text-xl mb-2">Ihr Warenkorb ist leer</CardTitle>
      <CardDescription className="mb-6 max-w-md">
        Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um später zur Kasse zu gehen.
      </CardDescription>
      <LocalizedClientLink href="/store">
        <Button className="gap-2 w-full sm:w-auto" variant="outline">
          <ShoppingBag className="h-4 w-4" />
          Produkte entdecken
        </Button>
      </LocalizedClientLink>
    </>
  )
}

export default EmptyCartMessage

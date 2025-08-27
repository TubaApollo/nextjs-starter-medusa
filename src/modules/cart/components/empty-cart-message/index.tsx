import { Button } from "@lib/components/ui/button"
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-16 px-4 flex flex-col justify-center items-center text-center space-y-6" data-testid="empty-cart-message">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Ihr Warenkorb ist leer</h1>
        <p className="text-gray-600 max-w-md">
          Sie haben noch keine Produkte in Ihrem Warenkorb. Lassen Sie uns das ändern!
        </p>
      </div>
      
      <InteractiveLink href="/store">
        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
          Produkte entdecken
        </Button>
      </InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage

import { Button } from "@lib/components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Haben Sie bereits ein Konto?
        </h2>
        <p className="text-gray-600">
          Melden Sie sich an für ein besseres Einkaufserlebnis.
        </p>
      </div>
      <LocalizedClientLink href="/account">
        <Button 
          variant="outline" 
          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          data-testid="sign-in-button"
        >
          Anmelden
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt

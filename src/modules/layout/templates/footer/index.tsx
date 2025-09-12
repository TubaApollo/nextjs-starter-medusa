// categories/collections removed from footer per design update
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CookiePreferencesButton } from "@modules/cookieconsent/CookiePreferencesButton"

export default async function Footer() {
  // no collections/categories fetched anymore

  return (
    <footer className="border-t border-ui-border-base w-full bg-white">
      <div className="content-container py-24">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand + short description + contact */}
          <div className="space-y-4">
            <LocalizedClientLink href="/" className="inline-block">
              <span className="txt-compact-xlarge-plus font-bold uppercase">Kreckler</span>
            </LocalizedClientLink>
            <p className="text-sm text-muted-foreground max-w-sm">
              Fachhandel für Regale, Lagerausstattung und industrielle Lösungen. Schnelle Lieferung und zuverlässiger Kundenservice.
            </p>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Telefon:</span>
                <a href="tel:+4900000000000" className="text-sm hover:text-ui-fg-base">+49 (0)000 000 0000</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <a href="mailto:kontakt@example.com" className="text-sm hover:text-ui-fg-base">kontakt@example.com</a>
              </div>
              <div className="text-sm text-muted-foreground">MO - FR: 07:30 - 16:30</div>
            </div>
          </div>

          {/* Column 2: Kundenservice */}
          <div>
            <h4 className="font-semibold txt-small-plus mb-3">Kundenservice</h4>
            <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <li><LocalizedClientLink href="/faq" className="hover:text-ui-fg-base">FAQ - Häufige Fragen</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/bestellvorgang" className="hover:text-ui-fg-base">Bestellvorgang</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/zahlungsarten" className="hover:text-ui-fg-base">Zahlungsarten</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/lieferung" className="hover:text-ui-fg-base">Lieferung</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/kontakt" className="hover:text-ui-fg-base">Kontakt</LocalizedClientLink></li>
            </ul>
          </div>

          {/* Column 3 removed (Produkte) */}

          {/* Column 4: Rechtliches + Trust & Payments */}
          <div className="space-y-4">
            <h4 className="font-semibold txt-small-plus mb-2">Rechtliches</h4>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li><LocalizedClientLink href="/impressum" className="hover:text-ui-fg-base">Impressum</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/agb" className="hover:text-ui-fg-base">AGB</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/datenschutz" className="hover:text-ui-fg-base">Datenschutz</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/widerruf" className="hover:text-ui-fg-base">Widerrufsbelehrung</LocalizedClientLink></li>
            </ul>

            <div className="border rounded-md p-3 bg-gradient-to-b from-white to-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500"><path d="M12 2l2.9 6.03L21 9.24l-5 3.9L17 21l-5-3.1L7 21l1-7.86-5-3.9 6.1-.21L12 2z" fill="currentColor"/></svg>
                </div>
                <div>
                  <div className="font-medium">Trustpilot</div>
                  <div className="text-xs text-muted-foreground">Sehr gut — 4.8 / 5</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex gap-2 items-center">
                  {/* Payment placeholders - replace with real logos if available */}
                  <div className="w-10 h-6 bg-gray-100 rounded-md flex items-center justify-center text-xs">VISA</div>
                  <div className="w-10 h-6 bg-gray-100 rounded-md flex items-center justify-center text-xs">MC</div>
                  <div className="w-10 h-6 bg-gray-100 rounded-md flex items-center justify-center text-xs">PAYPAL</div>
                  <div className="w-10 h-6 bg-gray-100 rounded-md flex items-center justify-center text-xs">SEPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kreckler. Alle Rechte vorbehalten.</div>
          <div className="flex items-center gap-4">
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  )
}

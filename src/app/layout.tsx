import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsentComponent from "@modules/cookieconsent/CookieConsent";
import { Toaster } from "sonner"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

import { SearchModalProvider } from "@lib/context/search-modal-context"
import { WishlistProvider } from "@lib/context/wishlist-context"
import { CustomerProvider } from "@lib/context/customer-context"
import { AuthMonitor } from "@lib/components/auth-monitor"
import AuthNotification from "../components/auth-notification"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <CustomerProvider>
          <SearchModalProvider>
            <WishlistProvider>
              <AuthMonitor />
              <AuthNotification />
              <main className="relative">{props.children}</main>
            </WishlistProvider>
          </SearchModalProvider>
        </CustomerProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <CookieConsentComponent />
      </body>
    </html>
  )
}

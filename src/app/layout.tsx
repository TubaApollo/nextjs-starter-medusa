import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsentComponent from "@modules/cookieconsent/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

import { SearchModalProvider } from "@lib/context/search-modal-context"; // Add this import
import SearchBox from "@modules/search/components/SearchBox"; // Import SearchBox

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <SearchModalProvider> {/* Wrap with SearchModalProvider */}
          <main className="relative">{props.children}</main>
          <SearchBox /> {/* Render SearchBox globally */}
        </SearchModalProvider>
        <CookieConsentComponent />
      </body>
    </html>
  )
}

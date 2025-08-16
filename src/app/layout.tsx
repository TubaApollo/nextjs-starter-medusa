import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsentComponent from "@modules/cookieconsent/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
        <CookieConsentComponent />
      </body>
    </html>
  )
}

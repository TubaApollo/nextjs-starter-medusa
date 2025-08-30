import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import AccountTitleClient from "@modules/account/components/account-title-client"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-8" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-6xl mx-auto flex flex-col gap-6">
        {customer ? (
          <div>
            <div className="grid grid-cols-1 small:grid-cols-[300px_1fr] py-8 gap-6 items-start">
              <aside className="rounded-lg bg-white border border-gray-100 shadow-sm overflow-hidden">
                {/* Sidebar component will render the styled nav */}
                <AccountNav customer={customer} />
              </aside>

              <main className="flex-1 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                {children}
              </main>
            </div>
            <AccountTitleClient />
          </div>
        ) : (
          <div className="py-12">
            {children}
          </div>
        )}

        <div className="flex flex-col small:flex-row items-end justify-between border-t border-gray-200 py-8 gap-6">
          <div>
            <h3 className="text-xl-semi mb-2">Fragen?</h3>
            <span className="txt-medium">
              Antworten auf häufige Fragen finden Sie auf unserer
              Kundendienstseite.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Kundendienst
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout

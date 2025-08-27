import { Metadata } from "next"
import ForgotPasswordTemplate from "@modules/account/templates/forgot-password-template"

export const metadata: Metadata = {
  title: "Passwort vergessen",
  description: "Setzen Sie Ihr Passwort zurück",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex-1 small:py-12" data-testid="forgot-password-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="py-12">
          <ForgotPasswordTemplate />
        </div>
      </div>
    </div>
  )
}

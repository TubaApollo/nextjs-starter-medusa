import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  description: "Geben Sie Ihr neues Passwort ein",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex-1 small:py-12" data-testid="reset-password-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="py-12">
          <ResetPasswordTemplate />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useActionState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Input } from "@lib/components/ui/input"
import { Button } from "@lib/components/ui/button"
import { Label } from "@lib/components/ui/label"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ShadcnRegister = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Become a Medusa Store Member</CardTitle>
          <CardDescription>
            Create your Medusa Store Member profile, and get access to an
            enhanced shopping experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  type="email"
                  autoComplete="email"
                  data-testid="email-input"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  data-testid="phone-input"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  autoComplete="new-password"
                  data-testid="password-input"
                />
              </div>
              <ErrorMessage error={message} data-testid="register-error" />
              <span className="text-center text-ui-fg-base text-small-regular">
                By creating an account, you agree to Medusa Store&apos;s{" "}
                <LocalizedClientLink
                  href="/content/privacy-policy"
                  className="underline"
                >
                  Privacy Policy
                </LocalizedClientLink>{" "}
                and{" "}
                <LocalizedClientLink
                  href="/content/terms-of-use"
                  className="underline"
                >
                  Terms of Use
                </LocalizedClientLink>
                .
              </span>
              <SubmitButton
                className="w-full mt-6"
                data-testid="register-button"
              >
                Join
              </SubmitButton>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <span className="text-center text-ui-fg-base text-small-regular">
            Already a member?{" "}
            <Button
              variant="link"
              onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            >
              Sign in
            </Button>
            .
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ShadcnRegister

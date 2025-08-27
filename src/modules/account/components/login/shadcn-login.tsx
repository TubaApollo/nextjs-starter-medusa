"use client"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useActionState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Input } from "@lib/components/ui/input"
import { Button } from "@lib/components/ui/button"
import { Label } from "@lib/components/ui/label"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ShadcnLogin = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to access an enhanced shopping experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                data-testid="email-input"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                data-testid="password-input"
              />
            </div>
            <ErrorMessage error={message} data-testid="login-error-message" />
            <SubmitButton data-testid="sign-in-button" className="w-full">
              Sign in
            </SubmitButton>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-center text-ui-fg-base text-small-regular">
          Not a member?{" "}
          <Button
            variant="link"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            data-testid="register-button"
          >
            Join us
          </Button>
          .
        </span>
      </CardFooter>
    </Card>
  )
}

export default ShadcnLogin

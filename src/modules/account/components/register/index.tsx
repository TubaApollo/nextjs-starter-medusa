"use client"

import { useActionState, useState } from "react"
import { motion } from "framer-motion"
import { signup } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { Button } from "@lib/components/ui/button"
import { Input } from "@lib/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Label } from "@lib/components/ui/label"
import { Alert, AlertDescription } from "@lib/components/ui/alert"
import { Checkbox } from "@lib/components/ui/checkbox"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { AlertCircle, Eye, EyeOff, CheckCircle, AlertTriangle, WifiOff } from "lucide-react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

// Helper function to determine error type and styling for registration
const getRegisterErrorConfig = (message: string) => {
  const messageLower = message.toLowerCase()
  
  if (messageLower.includes('verbindung') || messageLower.includes('netzwerk')) {
    return {
      variant: 'destructive' as const,
      icon: WifiOff,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600'
    }
  }
  
  if (messageLower.includes('existiert bereits') || messageLower.includes('already exists')) {
    return {
      variant: 'destructive' as const,
      icon: AlertTriangle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  }
  
  if (messageLower.includes('passwort') && (messageLower.includes('schwach') || messageLower.includes('kurz'))) {
    return {
      variant: 'destructive' as const,
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    }
  }
  
  if (messageLower.includes('erfolgreich') || messageLower.includes('success')) {
    return {
      variant: 'default' as const,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    }
  }
  
  // Default error styling
  return {
    variant: 'destructive' as const,
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600'
  }
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [password, setPassword] = useState("")

  // Helper function to check password strength
  const isPasswordValid = (pwd: string) => {
    return pwd.length >= 8 &&
           /[A-Z]/.test(pwd) &&
           /[a-z]/.test(pwd) &&
           /[0-9]/.test(pwd) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  }

  // Enhanced animation variants for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  }

  const fieldVariants = {
    hidden: { 
      opacity: 0, 
      y: 15,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.4, 0.0, 0.2, 1],
        delay: 0.1 
      }}
      className="w-full max-w-md"
      data-testid="register-page"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.2 
        }}
      >
        <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/95">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.4, 0.0, 0.2, 1],
              delay: 0.3 
            }}
          >
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Konto erstellen
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Erstellen Sie Ihr Konto für ein verbessertes Einkaufserlebnis
              </CardDescription>
            </CardHeader>
          </motion.div>
          <CardContent>
            <motion.form 
              action={formAction} 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="grid grid-cols-2 gap-4" variants={fieldVariants}>
                <div className="space-y-2 auth-field">
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                    Vorname
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="Max"
                    required
                    autoComplete="given-name"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                    data-testid="first-name-input"
                  />
                </div>
                <div className="space-y-2 auth-field">
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                    Nachname
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Mustermann"
                    required
                    autoComplete="family-name"
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                    data-testid="last-name-input"
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-2 auth-field" variants={fieldVariants}>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-Mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max@beispiel.de"
                  required
                  autoComplete="email"
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                  data-testid="email-input"
                />
              </motion.div>

              <motion.div className="space-y-2 auth-field" variants={fieldVariants}>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefon <span className="text-gray-400">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+49 (123) 456-7890"
                  autoComplete="tel"
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                  data-testid="phone-input"
                />
              </motion.div>

              <motion.div className="space-y-2 auth-field" variants={fieldVariants}>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Passwort
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sicheres Passwort erstellen"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                    data-testid="password-input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                    )}
                  </Button>
                </div>
                
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-gray-500 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Passwort-Stärke:</p>
                      <span className={`text-xs font-semibold ${
                        isPasswordValid(password) ? 'text-green-600' : 
                        password.length >= 4 ? 'text-yellow-600' : 'text-red-500'
                      }`}>
                        {isPasswordValid(password) ? 'Stark' : 
                         password.length >= 4 ? 'Mittel' : 'Schwach'}
                      </span>
                    </div>
                    
                    {/* Password strength progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isPasswordValid(password) ? 'bg-green-500 w-full' :
                          password.length >= 4 ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                        }`}
                      ></div>
                    </div>
                    
                    <p className="font-medium">Anforderungen:</p>
                    <ul className="space-y-1">
                      <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                        Mindestens 8 Zeichen
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        Mindestens ein Großbuchstabe
                      </li>
                      <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        Mindestens ein Kleinbuchstabe
                      </li>
                      <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        Mindestens eine Zahl
                      </li>
                      <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                        Mindestens ein Sonderzeichen
                      </li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>

              <motion.div 
                className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-200"
                variants={fieldVariants}
              >
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 data-[state=checked]:text-white border-gray-300 rounded-sm h-4 w-4"
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    Ich stimme den{" "}
                    <LocalizedClientLink
                      href="/content/privacy-policy"
                      className="text-red-600 hover:text-red-700 underline font-medium transition-colors duration-200"
                    >
                      Datenschutzbestimmungen
                    </LocalizedClientLink>{" "}
                    und{" "}
                    <LocalizedClientLink
                      href="/content/terms-of-use"
                      className="text-red-600 hover:text-red-700 underline font-medium transition-colors duration-200"
                    >
                      Nutzungsbedingungen
                    </LocalizedClientLink>{" "}
                    zu.
                  </Label>
                </div>
              </motion.div>

              {message && typeof message === 'string' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                >
                  {(() => {
                    const errorConfig = getRegisterErrorConfig(message as string)
                    const IconComponent = errorConfig.icon
                    
                    return (
                      <Alert 
                        variant={errorConfig.variant}
                        className={`animate-in fade-in-50 duration-300 ${errorConfig.bgColor} ${errorConfig.borderColor} border shadow-sm`}
                        data-testid="register-error"
                      >
                        <IconComponent className={`h-4 w-4 ${errorConfig.iconColor}`} />
                        <AlertDescription className={`${errorConfig.textColor} font-medium`}>
                          {message as string}
                        </AlertDescription>
                      </Alert>
                    )
                  })()}
                </motion.div>
              )}

              <motion.div variants={fieldVariants}>
                <Button
                  type="submit"
                  disabled={!agreedToTerms || !isPasswordValid(password)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-11 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                  data-testid="register-button"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Konto erstellen
                </Button>
              </motion.div>
            </motion.form>

            <motion.div 
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <span className="text-muted-foreground">Bereits Mitglied? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-red-600 hover:text-red-700 font-medium transition-all duration-200 hover:scale-105"
                onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
                data-testid="signin-button"
              >
                Anmelden
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Register

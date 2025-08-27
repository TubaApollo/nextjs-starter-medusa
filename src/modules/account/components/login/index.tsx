"use client"

import { useActionState } from "react"
import { motion } from "framer-motion"
import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { Button } from "@lib/components/ui/button"
import { Input } from "@lib/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Label } from "@lib/components/ui/label"
import { Alert, AlertDescription } from "@lib/components/ui/alert"
import { AlertCircle, Eye, EyeOff, Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

// Helper function to determine error type and styling
const getErrorConfig = (message: string) => {
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
  
  if (messageLower.includes('ungültig') || messageLower.includes('nicht gefunden')) {
    return {
      variant: 'destructive' as const,
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    }
  }
  
  if (messageLower.includes('server') || messageLower.includes('unerwarteter')) {
    return {
      variant: 'destructive' as const,
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
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

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)

  // Enhanced animation variants for form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
      data-testid="login-page"
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
                Willkommen zurück
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Melden Sie sich an für ein verbessertes Einkaufserlebnis
              </CardDescription>
            </CardHeader>
          </motion.div>
          <CardContent>
            <motion.form 
              action={formAction} 
              className="space-y-4"
              data-auth-form="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="space-y-2 auth-field" variants={fieldVariants}>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-Mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ihre E-Mail eingeben"
                  autoComplete="email"
                  required
                  className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                  data-testid="email-input"
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
                    placeholder="Ihr Passwort eingeben"
                    autoComplete="current-password"
                    required
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
              </motion.div>
              
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                >
                  {(() => {
                    const errorConfig = getErrorConfig(message)
                    const IconComponent = errorConfig.icon
                    
                    return (
                      <Alert 
                        variant={errorConfig.variant}
                        className={`animate-in fade-in-50 duration-300 ${errorConfig.bgColor} ${errorConfig.borderColor} border shadow-sm`}
                        data-testid="login-error-message"
                      >
                        <IconComponent className={`h-4 w-4 ${errorConfig.iconColor}`} />
                        <AlertDescription className={`${errorConfig.textColor} font-medium`}>
                          {message}
                        </AlertDescription>
                      </Alert>
                    )
                  })()}
                </motion.div>
              )}

              <motion.div 
                className="flex justify-end"
                variants={fieldVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <LocalizedClientLink
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Passwort vergessen?
                </LocalizedClientLink>
              </motion.div>

              <motion.div variants={fieldVariants}>
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 h-11 transform hover:scale-[1.02] active:scale-[0.98]"
                  data-testid="sign-in-button"
                >
                  Anmelden
                </Button>
              </motion.div>
            </motion.form>

            <motion.div 
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <span className="text-muted-foreground">Noch kein Mitglied? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-red-600 hover:text-red-700 font-medium transition-all duration-200 hover:scale-105"
                onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
                data-testid="register-button"
              >
                Registrieren
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Login

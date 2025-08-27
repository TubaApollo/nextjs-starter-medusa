"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@lib/components/ui/button"
import { Input } from "@lib/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Label } from "@lib/components/ui/label"
import { Alert, AlertDescription } from "@lib/components/ui/alert"
import { AlertCircle, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { sdk } from "@lib/config"

const ForgotPasswordTemplate = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Enhanced animation variants
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email) {
      setMessage({ type: 'error', text: 'E-Mail ist erforderlich' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await sdk.auth.resetPassword("customer", "emailpass", {
        identifier: email,
      })
      
      setMessage({ 
        type: 'success', 
        text: 'Wenn ein Konto mit dieser E-Mail-Adresse existiert, erhalten Sie Anweisungen zum Zurücksetzen des Passworts.' 
      })
      setIsSubmitted(true)
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full flex justify-center px-8 py-8 min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.1 
          }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                E-Mail gesendet
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Überprüfen Sie Ihre E-Mails für weitere Anweisungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && message.type === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Sie haben keine E-Mail erhalten? Überprüfen Sie Ihren Spam-Ordner oder versuchen Sie es erneut.
                </p>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => {
                    setIsSubmitted(false)
                    setMessage(null)
                    setEmail("")
                  }}
                >
                  Erneut versuchen
                </Button>

                <Link href="/account" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zur Anmeldung
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center px-8 py-8 min-h-[600px]">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.1 
        }}
        className="w-full max-w-md"
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
                  Passwort vergessen?
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen
                </CardDescription>
              </CardHeader>
            </motion.div>
            
            <CardContent>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-2 auth-field" variants={fieldVariants}>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-Mail-Adresse
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="h-11 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                    disabled={isLoading}
                  />
                </motion.div>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                  >
                    <Alert 
                      variant={message.type === 'error' ? 'destructive' : 'default'}
                      className={`animate-in fade-in-50 duration-300 ${
                        message.type === 'success' ? 'border-green-200 bg-green-50' : ''
                      }`}
                    >
                      {message.type === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <AlertDescription className={message.type === 'success' ? 'text-green-800' : ''}>
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div variants={fieldVariants}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 h-11 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wird gesendet...
                      </div>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Passwort zurücksetzen
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div 
                className="mt-6 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Link href="/account">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-all duration-200 hover:scale-105"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zur Anmeldung
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordTemplate

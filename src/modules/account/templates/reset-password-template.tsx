"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@lib/components/ui/button"
import { Input } from "@lib/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@lib/components/ui/card"
import { Label } from "@lib/components/ui/label"
import { Alert, AlertDescription } from "@lib/components/ui/alert"
import { AlertCircle, Eye, EyeOff, CheckCircle, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { sdk } from "@lib/config"

const ResetPasswordTemplate = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const token = useMemo(() => {
    return searchParams.get("token")
  }, [searchParams])
  
  const email = useMemo(() => {
    return searchParams.get("email")
  }, [searchParams])

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
    
    if (!token) {
      setMessage({ type: 'error', text: 'Ungültiger oder fehlender Reset-Token.' })
      return
    }

    if (!password) {
      setMessage({ type: 'error', text: 'Passwort ist erforderlich.' })
      return
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Passwort muss mindestens 8 Zeichen lang sein.' })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwörter stimmen nicht überein.' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await sdk.auth.updateProvider("customer", "emailpass", {
        email: email!,
        password,
      }, token)
      
      setMessage({ 
        type: 'success', 
        text: 'Ihr Passwort wurde erfolgreich zurückgesetzt!' 
      })
      setIsSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/account')
      }, 3000)
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Passwort konnte nicht zurückgesetzt werden. Bitte versuchen Sie es erneut.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If no token or email, show error state
  if (!token || !email) {
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
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Ungültiger Link
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Dieser Password-Reset-Link ist ungültig oder abgelaufen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Der Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen Link an.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Link href="/forgot-password" className="block">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 h-11">
                    Neuen Reset-Link anfordern
                  </Button>
                </Link>
                
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

  if (isSuccess) {
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
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Passwort zurückgesetzt
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sie werden in wenigen Sekunden zur Anmeldung weitergeleitet
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

              <Link href="/account" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 h-11">
                  Jetzt anmelden
                </Button>
              </Link>
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
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Neues Passwort erstellen
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Geben Sie Ihr neues Passwort für {email} ein
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
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Neues Passwort
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mindestens 8 Zeichen"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                      disabled={isLoading}
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

                <motion.div className="space-y-2 auth-field" variants={fieldVariants}>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Passwort bestätigen
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Passwort wiederholen"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 border-gray-200"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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

                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-gray-500 space-y-1"
                  >
                    <p className="font-medium">Passwort-Anforderungen:</p>
                    <ul className="space-y-1">
                      <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                        Mindestens 8 Zeichen
                      </li>
                      <li className={`flex items-center ${confirmPassword && password === confirmPassword ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${confirmPassword && password === confirmPassword ? 'text-green-600' : 'text-gray-400'}`} />
                        Passwörter stimmen überein
                      </li>
                    </ul>
                  </motion.div>
                )}

                <motion.div variants={fieldVariants}>
                  <Button
                    type="submit"
                    disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                    className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 h-11 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wird gespeichert...
                      </div>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
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

export default ResetPasswordTemplate

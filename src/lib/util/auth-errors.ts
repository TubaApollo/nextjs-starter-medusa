// Error translation utility for authentication
export function translateAuthError(error: string): string {
  // Convert the error to lowercase for easier matching
  const errorLower = error.toLowerCase()
  
  // Handle different types of authentication errors
  if (errorLower.includes('invalid email or password') || 
      errorLower.includes('invalid credentials') ||
      errorLower.includes('unauthorized')) {
    return 'E-Mail-Adresse oder Passwort sind ungültig. Bitte überprüfen Sie Ihre Eingaben.'
  }
  
  if (errorLower.includes('email not found') || 
      errorLower.includes('user not found')) {
    return 'Ein Konto mit dieser E-Mail-Adresse wurde nicht gefunden.'
  }
  
  if (errorLower.includes('email already exists') || 
      errorLower.includes('user already exists')) {
    return 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.'
  }
  
  if (errorLower.includes('password') && errorLower.includes('weak')) {
    return 'Das Passwort ist zu schwach. Bitte verwenden Sie mindestens 8 Zeichen.'
  }
  
  if (errorLower.includes('email') && errorLower.includes('invalid')) {
    return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
  }
  
  if (errorLower.includes('required') || errorLower.includes('missing')) {
    return 'Bitte füllen Sie alle erforderlichen Felder aus.'
  }
  
  if (errorLower.includes('network') || errorLower.includes('connection')) {
    return 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.'
  }
  
  if (errorLower.includes('server') || errorLower.includes('500')) {
    return 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
  }
  
  if (errorLower.includes('timeout')) {
    return 'Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.'
  }
  
  if (errorLower.includes('rate limit') || errorLower.includes('too many')) {
    return 'Zu viele Anmeldeversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.'
  }
  
  // If no specific match found, return a generic but user-friendly message
  return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.'
}

export function getErrorSeverity(error: string): 'warning' | 'error' {
  const errorLower = error.toLowerCase()
  
  // Warning level errors (user can fix these easily)
  if (errorLower.includes('invalid email or password') ||
      errorLower.includes('invalid credentials') ||
      errorLower.includes('email not found') ||
      errorLower.includes('required') ||
      errorLower.includes('missing') ||
      errorLower.includes('invalid email')) {
    return 'warning'
  }
  
  // All other errors are considered serious
  return 'error'
}

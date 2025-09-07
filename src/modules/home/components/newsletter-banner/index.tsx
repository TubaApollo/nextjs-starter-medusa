"use client"

import React, { useState } from "react"

export default function NewsletterBanner() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call - replace with actual newsletter subscription logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
    setEmail("")
  }

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <div className="content-container py-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vielen Dank!</h3>
            <p className="text-gray-600">Sie wurden erfolgreich für unseren Newsletter angemeldet.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 to-gray-800 text-white">
      <div className="content-container py-12 small:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <h2 className="text-2xl small:text-3xl font-bold mb-4">
              Bleiben Sie auf dem Laufenden
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Erhalten Sie die neuesten Informationen über neue Produkte, 
              Sonderangebote und Branchennews direkt in Ihr Postfach. 
              Verpassen Sie keine wichtigen Updates von Kreckler GmbH.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Exklusive Angebote
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Neue Produktankündigungen
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Branchennews & Tipps
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="lg:pl-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newsletter-email" className="sr-only">
                  E-Mail-Adresse
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ihre E-Mail-Adresse"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? "Wird angemeldet..." : "Newsletter abonnieren"}
              </button>
              
              <p className="text-xs text-gray-400 leading-relaxed">
                Mit der Anmeldung stimmen Sie unseren{" "}
                <a href="/datenschutz" className="text-red-400 hover:text-red-300 underline">
                  Datenschutzbestimmungen
                </a>{" "}
                zu. Sie können sich jederzeit wieder abmelden.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

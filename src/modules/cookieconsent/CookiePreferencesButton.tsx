"use client"

import React from "react"
import { showPreferences } from "vanilla-cookieconsent"
import { getBrowserLang } from "./getBrowserLang"
import pluginConfig from "./CookieConsentConfig"

export const CookiePreferencesButton: React.FC = () => {
  const lang = getBrowserLang()

  // Default fallback
  let label = "Show Cookie Preferences"

  const translations = pluginConfig.language?.translations?.[lang]

  if (
    translations &&
    typeof translations === "object" &&
    "consentModal" in translations &&
    translations.consentModal &&
    typeof translations.consentModal === "object" &&
    "showPreferencesBtn" in translations.consentModal
  ) {
    label = String(translations.consentModal.showPreferencesBtn)
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        showPreferences()
      }}
      className="txt-small-plus text-ui-fg-subtle hover:text-ui-fg-base underline"
    >
      {label}
    </button>
  )
}

export function getBrowserLang(): "en" | "de" {
  const lang = navigator.language || navigator.languages?.[0] || "en"
  const shortLang = lang.split("-")[0].toLowerCase()
  return shortLang === "de" ? "de" : "en"
}

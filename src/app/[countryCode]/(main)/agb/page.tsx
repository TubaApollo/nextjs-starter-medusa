"use client"
import { useState, useEffect } from 'react'

const AGBPage = () => {
  const [activeSection, setActiveSection] = useState('')

  const sections = [
    { id: "geltungsbereich", title: "1. Geltungsbereich" },
    { id: "vertragspartner", title: "2. Vertragspartner" },
    { id: "vertragsschluss", title: "3. Vertragsschluss" },
    { id: "preise", title: "4. Preise und Versandkosten" },
  ]

  // Custom scroll function to handle smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -80 // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      })
    }
  }

  // Track active section during scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar with sticky positioning that respects footer */}
      <aside className="w-full md:w-1/4 p-4 border-b md:border-r md:border-b-0 bg-white">
        <div className="md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
          <nav>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left text-lg cursor-pointer transition-colors duration-200 p-2 rounded ${
                      activeSection === section.id
                        ? 'text-black font-semibold bg-gray-100'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content without margin compensation */}
      <main className="w-full md:w-3/4 p-8 pt-8">
        <h1 className="text-3xl font-bold mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>
        
        <section id="geltungsbereich" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">1. Geltungsbereich</h2>
          <p className="leading-relaxed">
            Für alle Lieferungen von Max Mustermann an Verbraucher (§ 13 BGB)
            gelten diese Allgemeinen Geschäftsbedingungen (AGB).
          </p>
        </section>

        <section id="vertragspartner" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">2. Vertragspartner</h2>
          <p className="leading-relaxed">
            Der Kaufvertrag kommt zustande mit Max Mustermann, Musterstraße 1,
            12345 Musterstadt.
          </p>
        </section>

        <section id="vertragsschluss" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">3. Vertragsschluss</h2>
          <p className="leading-relaxed">
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich
            bindendes Angebot, sondern einen unverbindlichen Online-Katalog
            dar. Durch Anklicken des Buttons „Kaufen" geben Sie eine
            verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.
          </p>
        </section>

        <section id="preise" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">
            4. Preise und Versandkosten
          </h2>
          <p className="leading-relaxed">
            Die auf den Produktseiten genannten Preise enthalten die gesetzliche
            Mehrwertsteuer und sonstige Preisbestandteile. Zusätzlich zu den
            angegebenen Preisen berechnen wir für die Lieferung innerhalb
            Deutschlands pauschal 5,90 Euro pro Bestellung.
          </p>
        </section>

        {/* Add some extra space at bottom for better scrolling */}
        <div className="h-32"></div>
      </main>
    </div>
  )
}

export default AGBPage
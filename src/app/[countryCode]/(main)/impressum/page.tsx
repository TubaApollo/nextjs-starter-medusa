"use client"
import { useState, useEffect } from 'react'

const ImpressumPage = () => {
  const [activeSection, setActiveSection] = useState('')

  const sections = [
    { id: "angaben", title: "Angaben gemäß § 5 TMG" },
    { id: "kontakt", title: "Kontakt" },
    { id: "umsatzsteuer-id", title: "Umsatzsteuer-ID" },
    {
      id: "streitschlichtung",
      title: "EU-Streitschlichtung",
    },
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
        <section id="angaben" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="leading-relaxed">
            Max Mustermann
            <br />
            Musterstraße 1
            <br />
            12345 Musterstadt
          </p>
        </section>

        <section id="kontakt" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Kontakt</h2>
          <p className="leading-relaxed">
            Telefon: 01234 / 56789
            <br />
            E-Mail: max.mustermann@example.com
          </p>
        </section>

        <section id="umsatzsteuer-id" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Umsatzsteuer-ID</h2>
          <p className="leading-relaxed">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            DE123456789
          </p>
        </section>

        <section id="streitschlichtung" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">EU-Streitschlichtung</h2>
          <p className="leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              className="text-blue-600 hover:underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>

        {/* Add some extra space at bottom for better scrolling */}
        <div className="h-32"></div>
      </main>
    </div>
  )
}

export default ImpressumPage
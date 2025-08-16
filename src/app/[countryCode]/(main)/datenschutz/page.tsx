"use client"
import { useState, useEffect } from 'react'

const DatenschutzPage = () => {
  const [activeSection, setActiveSection] = useState('')

  const sections = [
    { id: "verantwortlicher", title: "1. Verantwortlicher" },
    { id: "erhebung", title: "2. Erhebung und Verarbeitung von Daten" },
    { id: "cookies", title: "3. Verwendung von Cookies" },
    { id: "rechte", title: "4. Ihre Rechte" },
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
      {/* Fixed sidebar with improved stability - respects footer */}
      <aside className="w-full md:w-1/4 md:fixed md:left-0 md:top-20 md:h-[calc(100vh-10rem)] md:overflow-y-auto p-4 border-b md:border-r md:border-b-0 bg-white z-10">
        <nav className="md:sticky md:top-20">
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
      </aside>

      {/* Main content with proper margin for fixed sidebar */}
      <main className="w-full md:w-3/4 md:ml-[25%] p-8 pt-8">
        <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>
        
        <section id="verantwortlicher" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">1. Verantwortlicher</h2>
          <p className="leading-relaxed">
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO)
            ist:
            <br />
            Max Mustermann
            <br />
            Musterstraße 1
            <br />
            12345 Musterstadt
            <br />
            E-Mail: max.mustermann@example.com
          </p>
        </section>

        <section id="erhebung" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">
            2. Erhebung und Verarbeitung von Daten
          </h2>
          <p className="leading-relaxed">
            Jeder Zugriff auf unsere Homepage und jeder Abruf einer auf der
            Homepage hinterlegten Datei werden protokolliert. Die Speicherung
            dient internen systembezogenen und statistischen Zwecken.
            Protokolliert werden: Name der abgerufenen Datei, Datum und Uhrzeit
            des Abrufs, übertragene Datenmenge, Meldung über erfolgreichen
            Abruf, Webbrowser und anfragende Domain.
          </p>
        </section>

        <section id="cookies" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">
            3. Verwendung von Cookies
          </h2>
          <p className="leading-relaxed">
            Unsere Internetseite verwendet Cookies. Cookies sind kleine
            Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr
            Browser speichert. Sie dienen dazu, unser Angebot
            nutzerfreundlicher, effektiver und sicherer zu machen.
          </p>
        </section>

        <section id="rechte" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">4. Ihre Rechte</h2>
          <p className="leading-relaxed">
            Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung,
            Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und
            Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten
            gegen das Datenschutzrecht verstößt oder Ihre
            datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt
            worden sind, können Sie sich bei der Aufsichtsbehörde beschweren.
          </p>
        </section>

        {/* Add some extra space at bottom for better scrolling */}
        <div className="h-32"></div>
      </main>
    </div>
  )
}

export default DatenschutzPage
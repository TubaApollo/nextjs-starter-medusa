"use client"
import { useState, useEffect } from 'react'

const WiderrufPage = () => {
  const [activeSection, setActiveSection] = useState('')

  const sections = [
    { id: "widerrufsrecht", title: "Widerrufsrecht" },
    { id: "folgen", title: "Folgen des Widerrufs" },
    { id: "muster", title: "Muster-Widerrufsformular" },
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
        <h1 className="text-3xl font-bold mb-8">Widerrufsbelehrung</h1>
        
        <section id="widerrufsrecht" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Widerrufsrecht</h2>
          <div className="space-y-4 leading-relaxed">
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
              diesen Vertrag zu widerrufen.
            </p>
            <p>
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder
              ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die
              Waren in Besitz genommen haben bzw. hat.
            </p>
            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Max Mustermann,
              Musterstraße 1, 12345 Musterstadt, E-Mail:
              max.mustermann@example.com) mittels einer eindeutigen Erklärung (z.
              B. ein mit der Post versandter Brief, Telefax oder E-Mail) über
              Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>
          </div>
        </section>

        <section id="folgen" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Folgen des Widerrufs</h2>
          <p className="leading-relaxed">
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
            die wir von Ihnen erhalten haben, einschließlich der Lieferkosten
            (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass
            Sie eine andere Art der Lieferung als die von uns angebotene,
            günstigste Standardlieferung gewählt haben), unverzüglich und
            spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem
            die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
            eingegangen ist.
          </p>
        </section>

        <section id="muster" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">
            Muster-Widerrufsformular
          </h2>
          <div className="space-y-4 leading-relaxed">
            <p>
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte
              dieses Formular aus und senden Sie es zurück.)
            </p>
            <p>
              An Max Mustermann, Musterstraße 1, 12345 Musterstadt, E-Mail:
              max.mustermann@example.com:
            </p>
            <p>
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
              Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der
              folgenden Dienstleistung (*)
            </p>
            <div className="bg-gray-50 p-4 rounded border">
              <p className="font-mono text-sm space-y-2">
                Bestellt am (*)/erhalten am (*)
                <br />
                Name des/der Verbraucher(s)
                <br />
                Anschrift des/der Verbraucher(s)
                <br />
                Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
                <br />
                Datum
              </p>
            </div>
            <p className="text-sm italic">(*) Unzutreffendes streichen.</p>
          </div>
        </section>

        {/* Add some extra space at bottom for better scrolling */}
        <div className="h-32"></div>
      </main>
    </div>
  )
}

export default WiderrufPage
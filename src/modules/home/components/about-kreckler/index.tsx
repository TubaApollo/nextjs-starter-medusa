import Image from "next/image"
import Link from "next/link"

export default function AboutKreckler() {
  return (
    <div className="content-container py-12 small:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="order-2 lg:order-1">
          <div className="mb-6">
            <h2 className="txt-xlarge font-bold tracking-tight text-slate-900 mb-2">
              Über uns Kreckler GmbH
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
          </div>
          
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Seit über 30 Jahren ist die Kreckler GmbH Ihr zuverlässiger Partner für 
              hochwertige Baumaschinen und Industrieausrüstung. Als traditionsreiches 
              Familienunternehmen stehen wir für Qualität, Service und Kompetenz.
            </p>
            
            <p>
              Unser umfassendes Sortiment umfasst Baumaschinen, Industriewerkzeuge, 
              Sicherheitsausrüstung und vieles mehr. Mit unserem erfahrenen Team 
              beraten wir Sie gerne bei der Auswahl der richtigen Ausrüstung für 
              Ihre Projekte.
            </p>
            
            <div className="pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Über 30 Jahre Erfahrung
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Umfassender Service & Support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Hochwertige Markenprodukte
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Persönliche Beratung
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Mehr erfahren
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
        
        {/* Image/Logo Section */}
        <div className="order-1 lg:order-2">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-50 rounded-2xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-red-50 rounded-2xl transform -rotate-1"></div>
            
            {/* Main content area */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                {/* Placeholder for Kreckler Logo */}
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-gray-100 rounded-full flex items-center justify-center">
                  <div className="text-2xl font-bold text-gray-600">
                    KRECKLER
                  </div>
                </div>
                
                {/* When you have the actual logo, replace the div above with: */}
                {/* <Image
                  src="/media/kreckler-logo.png"
                  alt="Kreckler GmbH Logo"
                  width={128}
                  height={128}
                  className="mx-auto mb-6"
                /> */}
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Kreckler GmbH
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Ihr Partner für Baumaschinen & Industrieausrüstung
                </p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Gegründet 1990</p>
                  <p>Familienunternehmen</p>
                  <p>Made in Germany</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

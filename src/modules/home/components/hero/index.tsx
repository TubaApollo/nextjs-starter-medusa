"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const slides = [
  {
    title: "Regal Commerce",
    subtitle: "Empowering your business with royal elegance",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=2400&q=80",
  },
  {
    title: "Luxury Shopping",
    subtitle: "Experience the future of ecommerce",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=80",
  },
  {
    title: "Open Source",
    subtitle: "Join our community of innovators",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2400&q=80",
  },
]

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleExploreStore = () => {
    router.push("/store")
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full border-b border-gray-200 bg-white">
      {/* Slides */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={currentSlide !== index}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            <div className="relative z-20 h-full flex items-center px-6 sm:px-8 lg:px-12">
              <div className="max-w-2xl mx-auto sm:mx-0 w-full">
                <div className="group relative bg-white/90 hover:bg-white transition-all duration-300 p-8 max-w-lg">
                  {/* Header with slide indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 border border-gray-300 group-hover:border-gray-500 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-300 group-hover:bg-gray-600 transition-colors duration-300"></div>
                    </div>
                    <span className="text-xs text-gray-400 font-light tracking-wider">
                      {String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 tracking-wide group-hover:text-black transition-colors duration-300">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-500 font-light leading-relaxed mb-6 group-hover:text-gray-600 transition-colors duration-300">
                    {slide.subtitle}
                  </p>

                  {/* Button with arrow */}
                  <button
                    onClick={handleExploreStore}
                    className="group flex items-center text-sm font-light text-gray-900 hover:text-black transition-colors duration-300"
                  >
                    Explore Store
                    <div className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors duration-300" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - matches category card style */}
      <div className="absolute bottom-8 left-8 z-30 flex space-x-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className="group flex items-center focus:outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className={`w-6 h-px bg-gray-400 transition-all duration-300 ${
              currentSlide === idx ? 'w-8 bg-gray-600' : 'group-hover:w-8 group-hover:bg-gray-500'
            }`} />
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 right-8 z-30 flex space-x-3">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-2 border border-gray-300 hover:border-gray-500 transition-colors duration-300 flex items-center justify-center group"
        >
          <div className="w-2 h-2 bg-gray-300 group-hover:bg-gray-600 transition-colors duration-300"></div>
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-2 border border-gray-300 hover:border-gray-500 transition-colors duration-300 flex items-center justify-center group"
        >
          <div className="w-2 h-2 bg-gray-300 group-hover:bg-gray-600 transition-colors duration-300"></div>
        </button>
      </div>
    </section>
  )
}

export default Hero
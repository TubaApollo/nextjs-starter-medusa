"use client"

import { useRef, useState } from "react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "@heroicons/react/24/solid"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const slides = [
  {
    title: "GaLa-Bau Themenshop",
    subtitle: "Premiumprodukte für Garten- und Landschaftsbauer",
    description: "Finden Sie hier eine große Auswahl an GaLa-Artikeln von Premiumherstellern zum Bestpreis",
    discount: "20%",
    ctaText: "JETZT ANGEBOTE ENTDECKEN",
    bgGradient: "from-slate-50 to-gray-100",
  },
  {
    title: "Industrieregale & Lagertechnik",
    subtitle: "Professionelle Lösungen für Ihr Lager",
    description: "Hochwertige Regalsysteme und Lagertechnik für optimale Organisation und maximale Effizienz in Ihrem Betrieb.",
    discount: "30%",
    ctaText: "REGALE ENTDECKEN",
    bgGradient: "from-blue-50 to-slate-100",
  },
  {
    title: "Baumaschinen & Werkzeuge",
    subtitle: "Profi-Ausrüstung für jede Baustelle",
    description: "Entdecken Sie unsere große Auswahl an Baumaschinen und Werkzeugen von führenden Herstellern.",
    discount: "25%",
    ctaText: "MASCHINEN ANSEHEN",
    bgGradient: "from-gray-50 to-slate-100",
  },
]

export default function HeroSwiper() {
  const swiperRef = useRef<SwiperRef | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="relative w-full">
      {/* Main Slider Container */}
      <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, A11y, Autoplay]}
          autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={800}
          loop
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="hero-swiper h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i} className="!h-full">
              <div className={`relative h-full w-full bg-gradient-to-br ${slide.bgGradient} overflow-hidden`}>
                {/* Content Layout - Mobile First */}
                <div className="h-full flex flex-col md:flex-row">
                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col justify-center md:justify-start px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
                    {/* Ensure content doesn't get covered by navigation - add margin on larger screens */}
                    <div className="max-w-lg md:mr-16 lg:mr-20 md:mt-4 lg:mt-6 xl:mt-8">
                      {/* Small Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-gray-600 text-xs sm:text-sm md:text-base mb-1 sm:mb-2 font-medium"
                      >
                        {slide.subtitle}
                      </motion.p>

                      {/* Main Title */}
                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Description - Hidden on mobile for space */}
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-gray-700 text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 leading-relaxed hidden sm:block"
                      >
                        {slide.description}
                      </motion.p>

                      {/* Enhanced CTA Button with Framer Motion */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        whileHover={{ 
                          scale: 1.02,
                          y: -1,
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
                        }}
                        whileTap={{ 
                          scale: 0.98
                        }}
                        className="group relative inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg shadow-lg text-sm sm:text-base overflow-hidden cursor-pointer"
                      >
                        {/* Background hover effect */}
                        <motion.div
                          className="absolute inset-0 bg-gray-800"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                        
                        {/* Content */}
                        <span className="relative z-10">{slide.ctaText}</span>
                        <motion.div
                          className="relative z-10"
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Right Side - Discount Badge (Hidden on mobile) */}
                  <div className="hidden md:flex flex-col items-center justify-center px-8 lg:px-12">
                    <motion.div
                      initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.7, type: "spring", bounce: 0.2 }}
                      className="relative"
                    >
                      {/* Discount Circle - Match site colors */}
                      <div className="bg-red-500 rounded-full w-28 h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 flex items-center justify-center shadow-lg transform -rotate-12">
                        <div className="text-center">
                          <div className="text-xs lg:text-sm font-bold text-white leading-tight">BIS ZU</div>
                          <div className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-none">-{slide.discount}</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Background Pattern for Image Placeholder */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination Dots - Positioned inside slider on bottom right */}
        <div className="absolute bottom-4 right-4 z-30">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => swiperRef.current?.swiper.slideToLoop(i)}
                whileHover={{ 
                  scale: 1.15
                }}
                whileTap={{ 
                  scale: 0.95
                }}
                animate={{
                  scale: activeIndex === i ? 1.1 : 1,
                  backgroundColor: activeIndex === i ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.6)"
                }}
                transition={{ 
                  duration: 0.2,
                  ease: "easeOut"
                }}
                className="w-3 h-3 rounded-full shadow-md backdrop-blur-sm border border-white/20 cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
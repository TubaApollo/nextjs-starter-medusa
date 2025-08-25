"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y, Autoplay, EffectFade } from "swiper/modules"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

const slides = [
  {
    title: "Aller Anfang ist die Ordnung.",
    subtitle: "10% Rabatt auf alle Fachbodenregale",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto-format&fit=crop&w=2400&q=80",
  },
  {
    title: "Industrieregale für Profis",
    subtitle: "Stabilität und Qualität, die überzeugt.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto-format&fit=crop&w=2400&q=80",
  },
  {
    title: "Maßgeschneiderte Regalsysteme",
    subtitle: "Ihre Lagerlösung nach Maß.",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto-format&fit=crop&w=2400&q=80",
  },
]

const AnimatedText = ({ text, el: Wrapper = "div", className, once, amount, stagger = 0.05 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  const defaultAnimations = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: stagger } },
  }

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={defaultAnimations}
        aria-hidden
      >
        {text.split(" ").map((word, i) => (
          <motion.span key={i} className="inline-block" variants={defaultAnimations}>
            {word}
            <span className="inline-block">&nbsp;</span>
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  )
}

export default function HeroSwiper() {
  const swiperRef = useRef<SwiperRef | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const goNext = useCallback(() => swiperRef.current?.swiper.slideNext(), [])
  const goPrev = useCallback(() => swiperRef.current?.swiper.slidePrev(), [])

  return (
    <div className="relative w-full h-[300px] md:h-[450px] lg:h-full overflow-hidden rounded-lg group">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={800}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="hero-swiper"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="!h-auto">
            <div className="absolute inset-0">
              <Image
                src={s.image}
                alt={s.title}
                fill
                style={{ objectFit: "cover" }}
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            {/* Text content */}
            <div className="absolute inset-0 flex flex-col justify-end items-start p-6 pb-16 md:p-12 md:pb-24">
              <div className="max-w-[90%] md:max-w-2xl">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight tracking-tight">
                  <AnimatedText text={s.title} el="span" once amount={0.2} />
                </h2>
                <p className="text-base md:text-xl lg:text-2xl text-gray-200">
                  <AnimatedText text={s.subtitle} el="span" once amount={0.2} stagger={0.02} />
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
        <motion.button
          aria-label="Vorheriger Slide"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)", color: "rgb(0,0,0)" }}
          onClick={goPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </motion.button>
        <motion.button
          aria-label="Nächster Slide"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.9)", color: "rgb(0,0,0)" }}
          onClick={goNext}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Custom Pagination / Progress */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
        <div className="flex gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-full">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.swiper.slideToLoop(i)}
              className="relative h-2 w-2 rounded-full focus:outline-none"
              aria-label={`Gehe zu Slide ${i + 1}`}
            >
              <div
                className={`h-full w-full rounded-full transition-colors ${
                  activeIndex === i ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
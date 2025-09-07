"use client"

import React, { useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y } from "swiper/modules"
import { motion } from "framer-motion"
import type { Swiper as SwiperType } from 'swiper'

// Swiper styles (needed once in the app bundle)
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface ProductSwiperProps {
  children: React.ReactNode
}

export default function ProductSwiper({ children }: ProductSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null)

  const handlePrevSlide = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNextSlide = () => {
    swiperRef.current?.slideNext()
  }
  return (
    <div className="relative w-full product-rail">
      {/* Navigation container for top-right positioning */}
      <div className="absolute top-0 right-0 z-20 flex gap-2 -mt-16">
        <button 
          onClick={handlePrevSlide}
          className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 text-gray-600 hover:text-gray-800"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button 
          onClick={handleNextSlide}
          className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 text-gray-600 hover:text-gray-800"
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Edge fades for nicer mobile swiping - only on mobile */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-0 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-0 bg-gradient-to-l from-white to-transparent z-10" />

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Pagination, A11y]}
        centeredSlides={false}
        centerInsufficientSlides={false}
        slidesPerView={1.2}
        spaceBetween={16}
        navigation={false}
        pagination={{
          clickable: true,
          dynamicBullets: false,
          hideOnClick: false,
          enabled: true,
        }}
        breakpoints={{
          640: {
            centeredSlides: false,
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            centeredSlides: false,
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="product-rail pb-12"
        style={{ padding: '8px' }} // Add padding to prevent shadow clipping
      >
        {React.Children.map(children, (child, idx) => (
          <SwiperSlide key={idx} className="!h-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-full"
            >
              {child}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        /* Container adjustments */
        .product-rail {
          position: relative;
          padding: 8px !important;
          margin: -8px !important;
          width: calc(100% + 16px) !important;
        }
        
        /* Swiper wrapper adjustments */
        .swiper-wrapper {
          align-items: stretch !important;
        }
        
        /* Mobile-specific centering */
        @media (max-width: 639px) {
          .product-rail .swiper {
            padding: 0 16px !important;
          }
        }
        
        /* Hide default navigation buttons since we use custom ones */
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
        
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 10px !important;
          font-weight: 600 !important;
        }
        
        /* Pagination styling */
        .swiper-pagination {
          position: static !important;
          margin: 16px 0 8px !important;
          text-align: center !important;
          padding: 0 !important;
          overflow: hidden;
        }
        
        .swiper-pagination-bullet {
          width: 16px !important;
          height: 2px !important;
          border-radius: 1px !important;
          background: #fecaca !important;
          opacity: 1 !important;
          margin: 0 1px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        
        .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          transform: scaleY(1.5) !important;
        }
        
        .swiper-pagination-bullet:hover {
          background: #f87171 !important;
          transform: scaleY(1.2) !important;
        }
        
        /* Ensure pagination is always visible */
        .swiper-pagination.swiper-pagination-hidden {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
    </div>
  )
}
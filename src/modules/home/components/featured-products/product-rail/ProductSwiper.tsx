"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y } from "swiper/modules"
import { motion } from "framer-motion"

// Swiper styles (needed once in the app bundle)
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface ProductSwiperProps {
  children: React.ReactNode
}

export default function ProductSwiper({ children }: ProductSwiperProps) {
  return (
    <div className="relative w-full product-rail">
      {/* Edge fades for nicer mobile swiping */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-0 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-0 bg-gradient-to-l from-white to-transparent z-10" />

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        centeredSlides={true}
        centerInsufficientSlides={true}
        slidesPerView={1.05}
        spaceBetween={16}
        navigation={{
          enabled: true,
          hideOnClick: false,
        }}
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
        className="!px-4 sm:!px-0 product-rail pb-12"
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
          padding: 0 16px !important;
          margin: 0 -16px !important;
          width: calc(100% + 32px) !important;
        }

        /* Navigation buttons - visible on all devices */
        .swiper-button-prev,
        .swiper-button-next {
          display: flex !important;
          width: 28px !important;
          height: 28px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(4px) !important;
          border-radius: 50% !important;
          border: 1px solid rgba(229, 231, 235, 0.8) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          color: #dc2626 !important;
          margin-top: 0 !important;
          transform: translateY(-50%) !important;
          transition: all 0.2s ease !important;
          z-index: 10 !important;
        }
        
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: #fff !important;
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }
        
        .swiper-button-prev {
          left: 4px !important;
        }
        
        .swiper-button-next {
          right: 4px !important;
        }
        
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 12px !important;
          font-weight: 800 !important;
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
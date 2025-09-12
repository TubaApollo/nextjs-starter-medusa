"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, A11y, Thumbs } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/thumbs"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-start relative">
        <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle" />
      </div>
    )
  }

  return (
    <div
      data-testid="image-gallery"
      className="flex items-start relative gap-x-4"
    >
      {/* Thumbnails - Hidden on mobile */}
      <div className="hidden sm:block w-[80px]">
        <Swiper
          direction="vertical"
          modules={[Navigation, A11y, Thumbs]}
          spaceBetween={10}
          slidesPerView={4}
          onSwiper={setThumbsSwiper}
          watchSlidesProgress
          slideToClickedSlide={true}
          className="h-[440px]"
        >
          {images.map((image, i) => (
            <SwiperSlide
              key={image.id}
              className="h-auto flex items-center justify-center"
            >
              <div
                className={`relative w-full aspect-square overflow-hidden rounded-md bg-white border transition-all duration-150 flex items-center justify-center ${
                  activeIndex === i
                    ? "border-yellow-400 shadow-lg"
                    : "border-ui-border-base hover:shadow-sm"
                }`}
              >
                {image.url && (
                  <img
                    src={image.url}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover rounded-sm"
                    loading="lazy"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main slider */}
      <div className="flex-1 w-full overflow-hidden relative">
        <Swiper
          modules={[Navigation, Pagination, A11y, Thumbs]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          watchOverflow={true}
          spaceBetween={12}
          onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
          className="product-swiper overflow-hidden w-full"
          observer={true}
          observeParents={true}
          key={images.length}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={image.id ?? index}
              className="flex justify-center items-center w-full"
            >
              <div className="relative w-full aspect-[29/34] overflow-hidden bg-ui-bg-subtle flex justify-center items-center">
                {image.url && (
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-contain rounded-rounded"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ImageGallery

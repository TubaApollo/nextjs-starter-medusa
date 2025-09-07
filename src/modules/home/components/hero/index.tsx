"use client"

import HeroSwiper from "./HeroSwiper"

interface HeroProps {
  categories: any[] // Keep for potential future use
  countryCode: string
  region: any // Keep for potential future use
}

const Hero: React.FC<HeroProps> = ({
  categories: initialCategories,
  countryCode,
  region,
}) => {
  return (
    <div className="content-container py-4 md:py-6">
      <HeroSwiper />
    </div>
  )
}

export default Hero
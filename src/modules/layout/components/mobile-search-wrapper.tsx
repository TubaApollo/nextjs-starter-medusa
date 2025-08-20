"use client"

import React, { useState, useEffect } from "react"
import SearchBox from "@modules/search/components/SearchBox"
import { useSearchModal } from "@lib/context/search-modal-context"

const MobileSearchWrapper: React.FC = () => {
  const { searchOpen } = useSearchModal()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      // Tailwind's 'md' breakpoint is 768px. We'll use this as our mobile threshold.
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isMobile) {
    // On mobile, only render SearchBox if the search modal is open
    return searchOpen ? <SearchBox /> : null
  } else {
    // On desktop, always render SearchBox (it will handle its own visibility)
    return <SearchBox />
  }
}

export default MobileSearchWrapper

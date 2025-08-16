"use client"

import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import SearchModal from "@modules/search/templates/search-modal"

export default function MobileSearchButton() {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <div className="xl:hidden flex items-center">
        <button
          className="text-ui-fg-base hover:text-ui-fg-subtle"
          onClick={handleOpenModal}
        >
          <FaSearch size={18} aria-hidden="true" />
        </button>
      </div>
      {showModal && <SearchModal onClose={handleCloseModal} />} 
    </>
  )
}

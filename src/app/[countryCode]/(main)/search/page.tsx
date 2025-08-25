"use client"

import React from "react"
import ImprovedSearchPage from "@modules/search/templates/ImprovedSearchPage"
import styles from "./search.module.css"

const SearchPage = () => {
  return (
    <div className={styles.searchPage}>
      {/* Main search experience with enhanced filtering */}
      <ImprovedSearchPage />
    </div>
  )
}

export default SearchPage
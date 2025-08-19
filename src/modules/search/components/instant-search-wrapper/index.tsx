"use client"

"use client"

import { InstantSearch } from "react-instantsearch-dom"
import { searchClient } from "@lib/search-client"

type InstantSearchWrapperProps = {
  children: React.ReactNode
  indexName: string
}

const InstantSearchWrapper = ({
  children,
  indexName,
}: InstantSearchWrapperProps) => {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      {children}
    </InstantSearch>
  )
}

export default InstantSearchWrapper

"use client"

import { useState, useCallback, useEffect } from 'react'
import { useSearchBox, useStats, useHits } from 'react-instantsearch'

export type SearchTab = 'products' | 'categories'

interface UseMultiIndexSearchProps {
  defaultTab?: SearchTab
}

interface SearchStats {
  nbHits: number
  processingTimeMS: number
  query: string
}

export const useMultiIndexSearch = ({ defaultTab = 'products' }: UseMultiIndexSearchProps = {}) => {
  const [activeTab, setActiveTab] = useState<SearchTab>(defaultTab)
  const [searchStats, setSearchStats] = useState<Record<SearchTab, SearchStats>>({
    products: { nbHits: 0, processingTimeMS: 0, query: '' },
    categories: { nbHits: 0, processingTimeMS: 0, query: '' }
  })

  const switchTab = useCallback((tab: SearchTab) => {
    setActiveTab(tab)
  }, [])

  const updateStats = useCallback((tab: SearchTab, stats: SearchStats) => {
    setSearchStats(prev => ({
      ...prev,
      [tab]: stats
    }))
  }, [])

  const getTabStats = useCallback((tab: SearchTab) => {
    return searchStats[tab]
  }, [searchStats])

  const hasResults = useCallback((tab: SearchTab) => {
    return searchStats[tab].nbHits > 0
  }, [searchStats])

  const getTotalResults = useCallback(() => {
    return Object.values(searchStats).reduce((total, stats) => total + stats.nbHits, 0)
  }, [searchStats])

  return {
    activeTab,
    switchTab,
    updateStats,
    getTabStats,
    hasResults,
    getTotalResults,
    searchStats
  }
}

// Hook for tracking search state within each index
export const useSearchState = (indexName: SearchTab) => {
  const { query } = useSearchBox()
  const { nbHits, processingTimeMS } = useStats()
  const { hits } = useHits()

  return {
    query,
    nbHits,
    processingTimeMS,
    hits,
    hasResults: nbHits > 0,
    isEmpty: nbHits === 0 && query.length > 0
  }
}

// Hook for managing search filters
export const useSearchFilters = () => {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({})

  const addFilter = useCallback((attribute: string, value: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      [attribute]: [...(prev[attribute] || []), value]
    }))
  }, [])

  const removeFilter = useCallback((attribute: string, value: string) => {
    setAppliedFilters(prev => ({
      ...prev,
      [attribute]: (prev[attribute] || []).filter(v => v !== value)
    }))
  }, [])

  const clearFilters = useCallback((attribute?: string) => {
    if (attribute) {
      setAppliedFilters(prev => ({
        ...prev,
        [attribute]: []
      }))
    } else {
      setAppliedFilters({})
    }
  }, [])

  const getFilterCount = useCallback((attribute?: string) => {
    if (attribute) {
      return appliedFilters[attribute]?.length || 0
    }
    return Object.values(appliedFilters).reduce((total, filters) => total + filters.length, 0)
  }, [appliedFilters])

  return {
    appliedFilters,
    addFilter,
    removeFilter,
    clearFilters,
    getFilterCount
  }
}
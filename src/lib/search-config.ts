export const SEARCH_CONFIG = {
  indices: {
    products: {
      name: 'products',
      hitsPerPage: 12,
      searchableAttributes: [
        'title',
        'description',
        'variant_sku',
        'categories',
        'tags',
        'type',
        'collection_title'
      ],
      attributesForFaceting: [
        'categories',
        'type',
        'tags',
        'status',
        'collection_title'
      ],
      customRanking: [
        'desc(created_at)',
        'asc(min_price)'
      ],
      highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800">',
      highlightPostTag: '</mark>',
      snippetEllipsisText: '…'
    },
    categories: {
      name: 'categories',
      hitsPerPage: 20,
      searchableAttributes: [
        'name',
        'description',
        'parent_category.name'
      ],
      attributesForFaceting: [
        'parent_category.name',
        'is_active'
      ],
      customRanking: [
        'desc(created_at)'
      ],
      highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800">',
      highlightPostTag: '</mark>',
      snippetEllipsisText: '…'
    }
  },
  ui: {
    searchBox: {
      placeholder: 'Search products and categories...',
      showLoadingIndicator: true,
      showSubmit: false,
      showReset: true
    },
    pagination: {
      showFirst: false,
      showLast: false,
      showPrevious: true,
      showNext: true,
      padding: 2
    },
    refinementList: {
      showMore: true,
      showMoreLimit: 20,
      searchable: true,
      searchablePlaceholder: 'Search...'
    }
  }
}

export const getSearchableAttributes = (indexName: string) => {
  return SEARCH_CONFIG.indices[indexName as keyof typeof SEARCH_CONFIG.indices]?.searchableAttributes || []
}

export const getFacetableAttributes = (indexName: string) => {
  return SEARCH_CONFIG.indices[indexName as keyof typeof SEARCH_CONFIG.indices]?.attributesForFaceting || []
}

export const getIndexConfig = (indexName: string) => {
  return SEARCH_CONFIG.indices[indexName as keyof typeof SEARCH_CONFIG.indices]
}
#!/usr/bin/env node

/**
 * MeiliSearch Configuration Script
 * 
 * This script configures your MeiliSearch indices with the proper
 * filterable attributes for category filtering and sorting.
 * 
 * Run with: node scripts/configure-meilisearch.js
 */

const { MeiliSearch } = require('meilisearch')

// Configuration from environment variables
const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || 'http://127.0.0.1:7700'
const MEILISEARCH_API_KEY = process.env.NEXT_PUBLIC_SEARCH_API_KEY || 'test_key'
const PRODUCTS_INDEX = process.env.NEXT_PUBLIC_MEILISEARCH_PRODUCTS_INDEX || 'products'
const CATEGORIES_INDEX = process.env.NEXT_PUBLIC_MEILISEARCH_CATEGORIES_INDEX || 'product_categories'

async function configureMeiliSearch() {
  console.log('🔧 Configuring MeiliSearch indices...')
  
  try {
    const client = new MeiliSearch({
      host: MEILISEARCH_HOST,
      apiKey: MEILISEARCH_API_KEY,
    })

    // Configure Products Index
    console.log(`📦 Configuring products index: ${PRODUCTS_INDEX}`)
    const productsIndex = client.index(PRODUCTS_INDEX)
    
    // Set filterable attributes for products
    await productsIndex.updateFilterableAttributes([
      'id',
      'handle',
      'status',
      'categories.id',
      'categories.name', 
      'categories.handle',
      'collection_id',
      'min_price',
      'max_price',
      'tags.id',
      'tags.value'
    ])
    
    // Set sortable attributes for products
    await productsIndex.updateSortableAttributes([
      'min_price',
      'max_price',
      'created_at',
      'updated_at',
      'title'
    ])

    // Configure Categories Index with Hierarchy Support
    console.log(`🏷️  Configuring categories index with hierarchy: ${CATEGORIES_INDEX}`)
    const categoriesIndex = client.index(CATEGORIES_INDEX)
    
    // Set searchable attributes for categories (including hierarchy path)
    await categoriesIndex.updateSearchableAttributes([
      'name',
      'description',
      'hierarchy_path'  // Allow searching within full hierarchy paths
    ])
    
    // Set filterable attributes for categories
    await categoriesIndex.updateFilterableAttributes([
      'id',
      'handle',
      'parent_category_id',
      'level',           // Filter by hierarchy level
      'hierarchy_handles' // Filter by hierarchy handles
    ])
    
    // Set displayed attributes for categories with hierarchy support
    await categoriesIndex.updateDisplayedAttributes([
      'id',
      'name', 
      'handle',
      'description',
      'thumbnail',
      'parent_category_id',
      'parent_category',     // Full parent category object
      'hierarchy_path',      // Array: ["Fachbodenregale", "Steckregale", "Einzelregal"]
      'hierarchy_handles',   // Array: ["fachbodenregale", "steckregale", "einzelregal"]
      'level'               // Number: 0=root, 1=child, 2=grandchild
    ])
    
    // Set sortable attributes for categories
    await categoriesIndex.updateSortableAttributes([
      'name',
      'level',           // Sort by hierarchy level
      'created_at',
      'updated_at'
    ])

    console.log('✅ MeiliSearch configuration completed successfully!')
    console.log('')
    console.log('📋 Products Index Configuration:')
    console.log('   Filterable:', ['id', 'handle', 'categories.id', 'categories.name', 'min_price', 'collection_id', 'tags.value'])
    console.log('   Sortable:', ['min_price', 'max_price', 'title'])
    console.log('')
    console.log('� Categories Index Configuration (with Hierarchy):')
    console.log('   Searchable:', ['name', 'description', 'hierarchy_path'])
    console.log('   Filterable:', ['id', 'handle', 'parent_category_id', 'level', 'hierarchy_handles'])
    console.log('   Sortable:', ['name', 'level', 'created_at', 'updated_at'])
    console.log('   Hierarchy Fields:', ['hierarchy_path', 'hierarchy_handles', 'level', 'parent_category'])
    console.log('')
    console.log('🎉 Category hierarchy paths will now display as: "Parent → Child → Grandchild"')
    console.log('💡 Make sure your backend indexes categories with these hierarchy fields!')
    
  } catch (error) {
    console.error('❌ Error configuring MeiliSearch:', error.message)
    console.log('')
    console.log('💡 Make sure:')
    console.log('   1. MeiliSearch is running at:', MEILISEARCH_HOST)
    console.log('   2. API key is correct:', MEILISEARCH_API_KEY ? '✓ Set' : '❌ Missing')
    console.log('   3. Indices exist:', PRODUCTS_INDEX, 'and', CATEGORIES_INDEX)
    process.exit(1)
  }
}

// Run the configuration
configureMeiliSearch()
import { motion } from "framer-motion"

interface SearchResult {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  price?: number
  category?: string
  inStock: boolean
}

interface ProductResultsProps {
  results: SearchResult[]
  onResults: (hasResults: boolean) => void
}

const ProductResults = ({ results, onResults }: ProductResultsProps) => {
  React.useEffect(() => {
    onResults(results.length > 0)
  }, [results, onResults])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          {result.thumbnail && (
            <img
              src={result.thumbnail}
              alt={result.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {result.title}
          </h3>
          {result.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {result.description}
            </p>
          )}
          {result.price && (
            <div className="text-xl font-bold text-gray-900 mb-3">
              €{result.price.toFixed(2)}
            </div>
          )}
          <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
            View Product
          </button>
        </motion.div>
      ))}
    </div>
  )
}

export default ProductResults

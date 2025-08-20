import { motion } from "framer-motion"

interface CategoryResult {
  id: string
  name: string
  handle: string
}

interface CategoryResultsProps {
  results: CategoryResult[]
  onResults: (hasResults: boolean) => void
}

const CategoryResults = ({ results, onResults }: CategoryResultsProps) => {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {result.name}
          </h3>
        </motion.div>
      ))}
    </div>
  )
}

export default CategoryResults

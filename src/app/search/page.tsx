import SearchBox from "../modules/search/components/search-box"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find products and categories in our store
        </p>
      </div>
      <SearchBox />
    </div>
  )
}
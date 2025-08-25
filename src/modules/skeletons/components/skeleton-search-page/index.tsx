const SearchPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="mx-auto w-full px-2 sm:container sm:px-4 py-3 sm:py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          
          {/* Search Input Skeleton */}
          <div className="max-w-3xl mx-auto">
            <div className="h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        
        {/* Stats and Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded-full w-20"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        
        <main className="flex flex-col lg:flex-row lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block shrink-0 lg:w-80 xl:w-96">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
              
              {/* Filter sections */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Categories Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="h-16 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SearchPageSkeleton
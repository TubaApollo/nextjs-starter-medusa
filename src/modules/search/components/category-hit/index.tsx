import Link from "next/link"

const CategoryHit = ({ hit }: { hit: any }) => {
  console.log("CategoryHit received hit:", hit);
  return (
    <Link href={`/categories/${hit.handle}`}>
      <div className="p-3 mb-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
        <span className="text-sm font-medium text-gray-800">{hit.name}</span>
      </div>
    </Link>
  )
}

export default CategoryHit
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [categories, collections] = await Promise.all([
      listCategories(),
      listCollections({ fields: "id,title" }),
    ])

    const categoryMap: Record<string, string> = {}
    categories.forEach((cat: any) => {
      categoryMap[cat.id] = cat.name
    })

    const collectionMap: Record<string, string> = {}
    collections.collections.forEach((coll: any) => {
      collectionMap[coll.id] = coll.title
    })

    return NextResponse.json({ categoryMap, collectionMap })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch search maps" },
      { status: 500 }
    )
  }
}

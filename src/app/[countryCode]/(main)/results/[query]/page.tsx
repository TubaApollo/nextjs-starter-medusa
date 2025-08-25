import { redirect } from "next/navigation"

type Params = {
  params: Promise<{ query: string; countryCode: string }>
  searchParams: Promise<{
    sortBy?: string
    page?: string
  }>
}

export default async function SearchResults(props: Params) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { query, countryCode } = params
  const { sortBy, page } = searchParams

  // Redirect to the main search page with query parameters
  const searchUrl = new URL(`/${countryCode}/search`, 'http://localhost:3000')
  searchUrl.searchParams.set('query', query)
  if (sortBy) searchUrl.searchParams.set('sortBy', sortBy)
  if (page) searchUrl.searchParams.set('page', page)

  redirect(searchUrl.pathname + searchUrl.search)
}
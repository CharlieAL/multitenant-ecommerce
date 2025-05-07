import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { loadFilters } from '~/modules/products/search-params'

import type { SearchParams } from 'nuqs/server'
import { ProductsView } from '~/modules/products/ui/views/products-view'

interface CategoryProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<SearchParams>
}

const Category = async ({ params, searchParams }: CategoryProps) => {
  const { category } = await params
  const filters = await loadFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({ category, ...filters }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView category={category} />
    </HydrationBoundary>
  )
}
export default Category

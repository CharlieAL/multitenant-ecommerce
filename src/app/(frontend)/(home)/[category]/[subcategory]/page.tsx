import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { loadFilters } from '~/modules/products/search-params'

import type { SearchParams } from 'nuqs/server'
import { ProductsView } from '~/modules/products/ui/views/products-view'

interface SubcategoryProps {
  params: Promise<{
    subcategory: string
  }>
  searchParams: Promise<SearchParams>
}

const Subcategory = async ({ params, searchParams }: SubcategoryProps) => {
  const { subcategory } = await params
  const filters = await loadFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({ category: subcategory, ...filters })
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView category={subcategory} />
    </HydrationBoundary>
  )
}
export default Subcategory

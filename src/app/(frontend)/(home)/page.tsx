import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { loadFilters } from '~/modules/products/search-params'

import type { SearchParams } from 'nuqs/server'
import { ProductsView } from '~/modules/products/ui/views/products-list-view'
import { DEFAULT_PRODUCTS_LIMIT } from '~/constants'

interface CategoryProps {
  searchParams: Promise<SearchParams>
}

const HomePage = async ({ searchParams }: CategoryProps) => {
  const filters = await loadFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({ ...filters, limit: DEFAULT_PRODUCTS_LIMIT })
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  )
}
export default HomePage

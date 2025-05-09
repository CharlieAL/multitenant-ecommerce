import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { loadFilters } from '~/modules/products/search-params'

import type { SearchParams } from 'nuqs/server'
import { ProductsView } from '~/modules/products/ui/views/products-view'

interface CategoryProps {
  searchParams: Promise<SearchParams>
}

const HomePage = async ({ searchParams }: CategoryProps) => {
  const filters = await loadFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({ ...filters }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView />
    </HydrationBoundary>
  )
}
export default HomePage

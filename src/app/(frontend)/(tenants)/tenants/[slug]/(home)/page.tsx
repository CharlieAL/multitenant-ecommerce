import { getQueryClient, trpc } from '~/trpc/server'

import { SearchParams } from 'nuqs'
import { loadFilters } from '~/modules/products/search-params'

import { ProductsView } from '~/modules/products/ui/views/products-list-view'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

interface TenantProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<SearchParams>
}

const Tenant = async ({ params, searchParams }: TenantProps) => {
  const { slug } = await params
  const filters = await loadFilters(searchParams)
  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug
    })
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsView narrowView tenantSlug={slug} />
    </HydrationBoundary>
  )
}
export default Tenant

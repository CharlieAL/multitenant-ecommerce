import { Suspense } from 'react'
import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ProductList, ProductListSkeleton } from '~/modules/products/ui/components/product-list'

interface CategoryProps {
  params: Promise<{
    category: string
  }>
}

const Category = async ({}: CategoryProps) => {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getMany.queryOptions())
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </HydrationBoundary>
  )
}
export default Category

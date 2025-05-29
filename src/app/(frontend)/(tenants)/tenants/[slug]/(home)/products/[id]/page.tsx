import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ProductView, ProductViewSkeleton } from '~/modules/products/ui/views/product-view'
import { getQueryClient, trpc } from '~/trpc/server'

interface ProductPageProps {
  params: Promise<{
    id: string
    slug: string
  }>
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id, slug } = await params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.products.getOne.queryOptions({ id }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={id} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  )
}
export default ProductPage

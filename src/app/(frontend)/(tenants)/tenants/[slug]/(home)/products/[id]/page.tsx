import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ProductView } from '~/modules/products/ui/views/product-view'
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
      <ProductView productId={id} tenantSlug={slug} />
    </HydrationBoundary>
  )
}
export default ProductPage

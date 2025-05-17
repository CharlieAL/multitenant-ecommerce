'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'
import { useCart } from '../../hooks/use-cart'

import { genereteTenantURL } from '~/lib/utils'
import { CheckoutItem, CheckoutItemSkeleton } from '../components/checkout-item'
import { CheckoutSidebar, CheckoutSidebarSkeleton } from '../components/checkout-sidebar'
import { InboxIcon } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useCheckoutStates } from '../../hooks/use-checkout-states'
import { useRouter } from 'next/navigation'

interface CheckoutViewProps {
  tenantSlug: string
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter()

  const [states, setStates] = useCheckoutStates()

  const { productsIds, clearCart, remove } = useCart(tenantSlug)

  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productsIds })
  )

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false })
      },
      onSuccess: (data) => {
        window.location.href = data.url
      },
      onError: (error) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          // TODO: Modify when subdomain enabled
          router.push('/sign-in')
        }
        toast.error(error.message)
      }
    })
  )

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false })
      clearCart()
      toast.success('Purchase successful!')
      router.push('/products')
    }
  }, [states.success, clearCart, router, setStates])

  useEffect(() => {
    if (error?.data?.code === 'NOT_FOUND') {
      toast.warning('Invalid products found in your cart, cart cleared.')
      clearCart()
    }
  }, [clearCart, error])

  if (data?.totalDocs === 0) {
    return (
      <div className='lg:p-16 p-4 lg:px-12'>
        <div className='border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white rounded-md'>
          <InboxIcon />
          <p className='text-base font-medium'>No products found</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='lg:p-16 p-4 lg:px-12'>
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16'>
          <div className='lg:col-span-4'>
            <div className='border rounded-md overflow-hidden bg-white divide-y'>
              {Array.from({ length: 6 }).map((_, index) => (
                <CheckoutItemSkeleton key={index} />
              ))}
            </div>
          </div>
          <div className='lg:col-span-3'>
            <CheckoutSidebarSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='lg:p-16 p-4 lg:px-12'>
      <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16'>
        <div className='lg:col-span-4'>
          <div className='border rounded-md overflow-hidden bg-white divide-y'>
            {data?.docs.map((product) => (
              <CheckoutItem
                key={product.id}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${genereteTenantURL(tenantSlug)}/products/${product.id}`}
                tenantUrl={genereteTenantURL(tenantSlug)}
                tenantName={product.tenant?.name}
                description={product?.description}
                price={product.price}
                onRemove={() => remove(product.id)}
              />
            ))}
          </div>
        </div>
        <div className='lg:col-span-3'>
          <CheckoutSidebar
            totalPrice={data?.totalPrice || 0}
            onPurchase={() =>
              purchase.mutate({
                productsIds,
                tenantSlug
              })
            }
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  )
}

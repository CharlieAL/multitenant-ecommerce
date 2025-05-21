import { cn } from '~/lib/utils'
import { Button } from './ui/button'
import { useCart } from '~/modules/checkout/hooks/use-cart'
import Link from 'next/link'

interface Props {
  tenantSlug: string
  productId: string
  isPurchased?: boolean
}

export const CartButton = ({ tenantSlug, productId, isPurchased }: Props) => {
  const { toggleProduct, hasProduct } = useCart(tenantSlug)
  return isPurchased ? (
    <Button variant={'elevated'} className='flex-1 font-medium' asChild>
      <Link prefetch href={`/library/${productId}`}>
        View in library
      </Link>
    </Button>
  ) : (
    <Button
      variant={'elevated'}
      className={cn('flex-1', hasProduct(productId) ? 'bg-white' : 'bg-pink-400')}
      onClick={() => {
        toggleProduct(productId)
      }}>
      {hasProduct(productId) ? 'Remove from cart' : 'Add to cart'}
    </Button>
  )
}

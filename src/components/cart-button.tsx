import { cn } from '~/lib/utils'
import { Button } from './ui/button'
import { useCart } from '~/modules/checkout/hooks/use-cart'

interface Props {
  tenantSlug: string
  productId: string
}

export const CartButton = ({ tenantSlug, productId }: Props) => {
  const cart = useCart(tenantSlug)
  return (
    <Button
      variant={'elevated'}
      className={cn('flex-1', cart.hasProduct(productId) ? 'bg-white' : 'bg-pink-400')}
      onClick={() => {
        cart.toggleProduct(productId)
      }}
    >
      {cart.hasProduct(productId) ? 'Remove from cart' : 'Add to cart'}
    </Button>
  )
}

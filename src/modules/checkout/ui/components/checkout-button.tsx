import { Button } from '~/components/ui/button'
import { cn, genereteTenantURL } from '~/lib/utils'

import { useCart } from '../../hooks/use-cart'
import Link from 'next/link'
import { ShoppingCartIcon } from 'lucide-react'

interface CheckoutButtonProps {
  className?: string
  hideIfEmpty?: boolean
  tanantSlug: string
}

export const CheckoutButton = ({ tanantSlug, className, hideIfEmpty }: CheckoutButtonProps) => {
  const { totalProducts } = useCart(tanantSlug)

  if (hideIfEmpty && totalProducts === 0) return null

  return (
    <Button asChild variant={'elevated'} className={cn('bg-white', className)}>
      <Link href={`${genereteTenantURL(tanantSlug)}/checkout`}>
        <ShoppingCartIcon />
        {totalProducts || ''}
      </Link>
    </Button>
  )
}

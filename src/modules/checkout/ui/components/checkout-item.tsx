import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '~/components/ui/skeleton'
import { PLACEHOLDER_IMAGE } from '~/constants'
import { formatCurrency } from '~/lib/utils'

interface CheckoutItemProps {
  imageUrl?: string | null
  name: string
  productUrl: string
  tenantUrl: string
  tenantName?: string
  description?: string | null
  price: number
  onRemove: () => void
}

export const CheckoutItem = ({
  imageUrl,
  name,
  productUrl,
  tenantUrl,
  tenantName,
  description,
  price,
  onRemove
}: CheckoutItemProps) => {
  return (
    <div className='grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4'>
      <div className='overflow-hidden border-r '>
        <div className='relative aspect-square h-full'>
          <Image src={imageUrl || PLACEHOLDER_IMAGE} alt={name} className='object-cover' fill />
        </div>
      </div>
      <div className='py-4 flex flex-col justify-between'>
        <div>
          <Link href={productUrl}>
            <h4 className='text-lg font-bold hover:underline'>{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <p className='font-medium hover:underline '>{tenantName}</p>
          </Link>
        </div>
        {description && (
          <p className='line-clamp-2 text-pretty text-muted-foreground text-base'>{description}</p>
        )}
      </div>
      <div className='py-4 flex flex-col justify-between'>
        <p className='font-medium'>{formatCurrency(price)}</p>
        <button
          className='font-medium hover:underline cursor-pointer'
          onClick={onRemove}
          type='button'
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export const CheckoutItemSkeleton = () => {
  return (
    <div className='grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4'>
      <div className='overflow-hidden border-r '>
        <Skeleton className='relative aspect-square h-full bg-gray-200 animate-pulse' />
      </div>
      <div className='py-4 flex flex-col justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-28' />
        </div>
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-3 w-56' />
          <Skeleton className='h-3 w-36' />
        </div>
      </div>
      <div className='py-4 flex flex-col justify-between'>
        <Skeleton className='h-4 w-10' />

        <Skeleton className='h-4 w-16' />
      </div>
    </div>
  )
}

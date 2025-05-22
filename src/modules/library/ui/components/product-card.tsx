import Link from 'next/link'
import Image from 'next/image'

import { StarIcon } from 'lucide-react'

import { PLACEHOLDER_IMAGE } from '~/constants'

// TODO: add real ratings

interface ProductCardProps {
  id: string
  name: string
  imageUrl?: string | null
  tenantSlug: string
  tenantImageUrl?: string | null
  reviewRating: number
  reviewCount: number
}

export const ProductCard = (props: ProductCardProps) => {
  return (
    <Link prefetch href={`/library/${props.id}`}>
      <div className='hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all  border rounded-md bg-white overflow-hidden h-full flex flex-col'>
        <div className='relative aspect-square'>
          <Image
            alt={props.name}
            src={props.imageUrl || PLACEHOLDER_IMAGE}
            fill
            className='object-cover'
          />
        </div>
        <div className='p-4 border-y flex flex-col gap-3 flex-1'>
          <h2 className='text-lg font-medium line-clamp-4'>{props.name}</h2>
          <div className='flex items-center gap-2 '>
            {props.tenantImageUrl && (
              <Image
                alt={props.tenantSlug}
                src={props.tenantImageUrl}
                width={16}
                height={16}
                className='rounded-full border shrink-0 size-[16px]'
              />
            )}
            <p className='text-sm hover:underline font-medium '>{props.tenantSlug}</p>
          </div>
          {props.reviewCount > 0 && (
            <div className='flex items-center gap-1'>
              <StarIcon className='size-3.5 fill-black' />
              <p className='text-sm font-medium'>
                {props.reviewRating} ({props.reviewCount})
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export const ProductCardSkeleton = () => {
  return <div className='w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse'></div>
}

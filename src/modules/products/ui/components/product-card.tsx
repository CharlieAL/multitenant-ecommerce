import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PLACEHOLDER_IMAGE } from '~/constants'

interface ProductCardProps {
  id: string
  name: string
  imageUrl?: string | null
  authorUsername: string
  authorImageUrl?: string | null
  reviewRating: number
  reviewCount: number
  price: number
}

export const ProductCard = (props: ProductCardProps) => {
  return (
    <Link href={`/products/${props.id}`}>
      <div className='hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all  border rounded-md bg-white overflow-hidden h-full flex flex-col'>
        <div className='relative aspect-square'>
          <Image
            alt={props.name}
            src={props.imageUrl || PLACEHOLDER_IMAGE}
            fill
            objectFit='cover'
          />
        </div>
        <div className='p-4 border-y flex flex-col gap-3 flex-1'>
          <h2 className='text-lg font-medium line-clamp-4'>{props.name}</h2>
          {/* TODO: redirect to user shop */}
          <div className='flex items-center gap-2'>
            {props.authorImageUrl && (
              <Image
                alt={props.authorUsername}
                src={props.authorImageUrl}
                width={16}
                height={16}
                className='rounded-full border shrink-0 size-[16px]'
              />
            )}
            <p className='text-sm underline font-medium'>{props.authorUsername}</p>
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
        <div className='p-4'>
          <div className='relative px-2 py-1 border bg-pink-400 w-fit'>
            <p className='text-sm font-medium'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 1
              }).format(props.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export const ProductCardSkeleton = () => {
  return <div className='w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse'></div>
}

'use client'

// TODO: add real ratings

import dynamic from 'next/dynamic'

import { useTRPC } from '~/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

import Image from 'next/image'
import { formatCurrency, genereteTenantURL } from '~/lib/utils'
import Link from 'next/link'
import { StarRating } from '~/components/star-rating'
import { Button } from '~/components/ui/button'
import { LinkIcon, StarIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Progress } from '~/components/ui/progress'
import { toast } from 'sonner'
import { Skeleton } from '~/components/ui/skeleton'
import { RichText } from '@payloadcms/richtext-lexical/react'

const CartButton = dynamic(() => import('~/components/cart-button').then((mod) => mod.CartButton), {
  ssr: false,
  loading: () => (
    <Button disabled variant={'elevated'} className='flex-1 bg-pink-400'>
      ...
    </Button>
  )
})

interface ProductViewProps {
  productId: string
  tenantSlug: string
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.products.getOne.queryOptions({ id: productId }))
  const priceFormat = formatCurrency(data.price)

  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className='px-4 lg:px-12 py-10'>
      <div className='border rounded-sm bg-white overflow-hidden'>
        <div className='relative aspect-[3.9] border-b'>
          <Image
            src={data.image?.url || '/placeholder.png'}
            alt={data.name}
            fill
            className='object-cover'
          />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-6'>
          <div className='col-span-4'>
            <div className='p-6'>
              <h1 className='text-4xl font-medium'>{data.name}</h1>
            </div>
            <div className='border-y flex '>
              <div className='px-6 py-4 flex items-center justify-center border-r'>
                <div className=' px-2 py-1 border bg-pink-400 w-fit'>
                  <p className='text-base font-medium'>{priceFormat}</p>
                </div>
              </div>
              <div className='px-6 py-4 flex items-center justify-center lg:border-r'>
                <Link
                  href={genereteTenantURL(tenantSlug)}
                  className='flex items-center gap-2 group'>
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image?.url}
                      alt={data.tenant.name}
                      width={30}
                      height={30}
                      className='rounded-full border shrink-0 size-[30px]'
                    />
                  )}
                  <p className='text-base group-hover:underline font-medium'>{data.tenant.name}</p>
                </Link>
              </div>
              <div className='hidden lg:flex px-6 py-4 items-center justify-center'>
                <div className='flex items-center gap-2'>
                  <StarRating rating={data.reviewRating} />
                  <p className='text-base font-medium'>{data.reviewCount} ratings</p>
                </div>
              </div>
            </div>
            <div className='flex lg:hidden px-6 py-4 items-center justify-center border-b'>
              <div className='flex items-center gap-2'>
                <StarRating rating={data.reviewRating} />
                <p className='text-base font-medium'>{data.reviewCount} ratings</p>
              </div>
            </div>
            <div className='p-6 '>
              {data.description ? (
                <RichText data={data.description} />
              ) : (
                <p className='font-medium text-muted-foreground italic'>No description provider</p>
              )}
            </div>
          </div>
          <div className='col-span-2'>
            <div className='border-t lg:border-t-0 lg:border-l h-full'>
              <div className='flex flex-col gap-4 p-6 border-b'>
                <div className='flex flex-wrap items-center gap-2'>
                  <CartButton
                    isPurchased={data.isPurchased}
                    tenantSlug={tenantSlug}
                    productId={productId}
                  />

                  <Button
                    className='size-12'
                    variant={'elevated'}
                    onClick={() => {
                      setIsCopied(true)
                      navigator.clipboard.writeText(location.href)
                      toast.success('Link copied to clipboard')

                      setTimeout(() => {
                        setIsCopied(false)
                      }, 2000)
                    }}
                    disabled={isCopied}>
                    <LinkIcon />
                  </Button>
                </div>
                <p className='text-center font-medium'>
                  {data.refundPolicy === 'no-refund'
                    ? 'No refund'
                    : `${data.refundPolicy} money back guarantee`}
                </p>
              </div>
              <div className='p-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-medium'>Ratings</h3>
                  <div className='flex items-center gap-x-1 font-medium'>
                    <StarIcon className='size-4 fill-black' />
                    <p>({data.reviewRating})</p>
                    <p className='text-base'>{data.reviewCount}</p>
                  </div>
                </div>
                <div className='grid grid-cols-[auto_1fr_auto] gap-3 mt-3'>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Fragment key={star}>
                      <div className='font-medium'>
                        {star} {star === 1 ? 'star' : 'stars'}
                      </div>
                      <Progress value={data.ratingDistribution[star]} className='h-[1lh]' />
                      <div className='font-medium'>{data.ratingDistribution[star]}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProductViewSkeleton = () => {
  return (
    <div className='px-4 lg:px-12 py-10'>
      <div className='border rounded-sm bg-white overflow-hidden'>
        <div className='relative aspect-[3.9] border-b'>
          <Skeleton className='h-full w-full' />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-6'>
          <div className='col-span-4'>
            <div className='p-6'>
              <Skeleton className='h-10 w-3/4' />
            </div>
            <div className='border-y flex'>
              <div className='px-6 py-4 flex items-center justify-center border-r'>
                <Skeleton className='h-8 w-24' />
              </div>
              <div className='px-6 py-4 flex items-center justify-center lg:border-r'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-[30px] w-[30px] rounded-full' />
                  <Skeleton className='h-6 w-32' />
                </div>
              </div>
              <div className='hidden lg:flex px-6 py-4 items-center justify-center'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-20' />
                </div>
              </div>
            </div>
            <div className='flex lg:hidden px-6 py-4 items-center justify-center border-b'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
            <div className='p-6'>
              <Skeleton className='h-20 w-full' />
            </div>
          </div>
          <div className='col-span-2'>
            <div className='border-t lg:border-t-0 lg:border-l h-full'>
              <div className='flex flex-col gap-4 p-6 border-b'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Skeleton className='h-10 flex-1' />
                  <Skeleton className='h-12 w-12' />
                </div>
                <Skeleton className='h-6 w-full' />
              </div>
              <div className='p-6'>
                <div className='flex items-center justify-between'>
                  <Skeleton className='h-6 w-24' />
                  <Skeleton className='h-6 w-20' />
                </div>
                <div className='grid grid-cols-[auto_1fr_auto] gap-3 mt-3'>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Fragment key={star}>
                      <Skeleton className='h-6 w-16' />
                      <Skeleton className='h-6' />
                      <Skeleton className='h-6 w-12' />
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

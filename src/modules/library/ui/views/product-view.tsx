'use client'
import { ArrowLeftIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'

import { useTRPC } from '~/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ReviewSidebar } from '../components/review-sidebar'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ReviewFormSkeleton } from '../components/review-form'

interface ProductViewProps {
  productId: string
}

export const ProductView = ({ productId }: ProductViewProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.library.getOne.queryOptions({ productId }))
  return (
    <div className='min-h-screen bg-white'>
      <nav className='p-4 bg-[#f4f4f0] w-full border-b'>
        <Link prefetch href={'/library'} className='flex items-center gap-2'>
          <ArrowLeftIcon className='size-4' />
          <span className='text font-medium'>Back to library</span>
        </Link>
      </nav>
      <header className='bg-[#f4f4f0] py-8 border-b'>
        <div className='max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4'>
          <h1 className='text-[40px] font-medium'>{data.name}</h1>
        </div>
      </header>
      <section className='max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12  py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16'>
          <div className='lg:col-span-2'>
            <div className='p-4 bg-white rounded-md border gap-4'>
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewSidebar productId={productId} />
              </Suspense>
            </div>
          </div>
          <div className='lg:col-span-5'>
            {data.content ? (
              <RichText data={data.content} />
            ) : (
              <p className='font-medium text-muted-foreground italic'>No special content</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export const ProductViewSkeleton = () => {
  return (
    <div className='min-h-screen bg-white'>
      <nav className='p-4 bg-[#f4f4f0] w-full border-b'>
        <Link href={'/library'} className='flex items-center gap-2'>
          <ArrowLeftIcon className='size-4' />
          <span className='text font-medium'>Back to library</span>
        </Link>
      </nav>
      <header className='bg-[#f4f4f0] py-8 border-b'>
        <div className='max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4'>
          <Skeleton className='w-48 h-[40px]' />
          <Skeleton className='w-32 h-[20px]' />
        </div>
      </header>
      <section className='max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12  py-10'>
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16'>
          <div className='lg:col-span-2'>
            <div className='p-4 bg-white rounded-md border gap-1 flex'>
              <StarIcon className='size-6 stroke-black animate-bounce delay-0' />
              <StarIcon className='size-6 stroke-black animate-bounce delay-75' />
              <StarIcon className='size-6 stroke-black animate-bounce delay-100' />
              <StarIcon className='size-6 stroke-black animate-bounce delay-150' />
              <StarIcon className='size-6 stroke-black animate-bounce delay-200' />
            </div>
          </div>
          <div className='lg:col-span-5'>
            <Skeleton className='w-full h-[200px]' />
          </div>
        </div>
      </section>
    </div>
  )
}

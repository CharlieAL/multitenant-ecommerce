'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'

import { Categories } from './categories'
import { SearchInput } from './search-input'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'

export const SearchFilters = () => {
  return (
    <Suspense fallback={<SearchFiltersSkeleton />}>
      <SearchFiltersSuspense />
    </Suspense>
  )
}

const SearchFiltersSkeleton = () => {
  return (
    <div
      className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'
      style={{
        backgroundColor: '#f5f5f5'
      }}
    >
      <SearchInput disabled />
      <div className='hidden lg:block'>
        <Skeleton className='w-full h-11 rounded-full' />
      </div>
    </div>
  )
}

const SearchFiltersSuspense = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())
  return (
    <div
      className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'
      style={{
        backgroundColor: '#f5f5f5'
      }}
    >
      <SearchInput />
      <div className='hidden lg:block'>
        <Categories data={data ?? []} />
      </div>
    </div>
  )
}

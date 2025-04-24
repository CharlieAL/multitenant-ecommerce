'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'

import { Categories } from './categories'
import { SearchInput } from './search-input'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { useParams } from 'next/navigation'
import { DEFAULT_BG_COLOR } from '~/modules/home/constants'
import { BreadcrumbsNavigation } from './breadcrumbs-navigation'

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
        backgroundColor: DEFAULT_BG_COLOR
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
  const params = useParams()

  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  const categoryParam = params?.category as string | undefined

  const activeCategory = categoryParam || 'all'
  const activeCategoryData = data.find((category) => category.slug === activeCategory)

  const categoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR
  const activeCategoryName = activeCategoryData?.name || null
  const activeSubcategory = params?.subcategory as string | undefined
  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find((sub) => sub.slug === activeSubcategory)?.name || null

  return (
    <div
      className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'
      style={{
        backgroundColor: categoryColor
      }}
    >
      <SearchInput />
      <div className='hidden lg:block'>
        <Categories data={data ?? []} />
      </div>
      <BreadcrumbsNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  )
}

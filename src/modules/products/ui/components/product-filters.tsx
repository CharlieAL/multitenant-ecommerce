'use client'
import { useState } from 'react'

import { cn } from '~/lib/utils'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'

import { useFilters } from '~/hooks/use-filters'

import { PriceFilter } from './filters/price'
import { TagsFilter } from './filters/tags'

interface ProductFiltersProps {
  title: string
  className?: string
  children: React.ReactNode
}

const ProductFilter = ({ title, className, children }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon

  return (
    <div className={cn(' border-b flex flex-col gap-1', className)}>
      <button
        type='button'
        onClick={() => setIsOpen((current) => !current)}
        className='flex items-center justify-between cursor-pointer p-4'
      >
        <p className='font-medium'>{title}</p>
        <Icon className='size-5' />
      </button>
      {isOpen && <div className='px-4 pb-4'>{children}</div>}
    </div>
  )
}

export const ProductFilters = () => {
  const [filters, setFilters] = useFilters()

  const hasAnyFilter = Object.entries(filters).some(([key, value]) => {
    if (key === 'sort') return false
    if (Array.isArray(value)) return value.length > 0

    if (typeof value === 'string') return value !== ''

    return value !== null
  })

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters((current) => ({
      ...current,
      [key]: value
    }))
  }
  return (
    <div className='border rounded-md bg-white'>
      <div className='p-4 border-b flex items-center justify-between'>
        <p className='font-medium'>Filters</p>
        {hasAnyFilter && (
          <button
            className='underline cursor-pointer'
            onClick={() => {
              console.log('first')
              setFilters(null)
            }}
            type='button'
          >
            Clear
          </button>
        )}
      </div>
      <ProductFilter title='Price'>
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(minPrice) => onChange('minPrice', minPrice)}
          onMaxPriceChange={(maxPrice) => onChange('maxPrice', maxPrice)}
        />
      </ProductFilter>
      <ProductFilter title='Tags' className='border-b-0'>
        <TagsFilter value={filters.tags} onChange={(tags) => onChange('tags', tags)} />
      </ProductFilter>
    </div>
  )
}

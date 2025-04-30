'use client'

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '~/lib/utils'
import { PriceFilter } from './filters/price'
import { useFilters } from '../../hooks/use-filters'

interface ProductFiltersProps {
  title: string
  className?: string
  children: React.ReactNode
}

const ProductFilter = ({ title, className, children }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon

  return (
    <div className={cn('p-4 border-b flex flex-col gap-2', className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className='flex items-center justify-between cursor-pointer'
      >
        <p className='font-medium'>{title}</p>
        <Icon className='size-5' />
      </div>
      {isOpen && children}
    </div>
  )
}

export const ProductFilters = () => {
  const [filters, setFilters] = useFilters()

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
        <button className='underline' onClick={() => {}} type='button'>
          Clear
        </button>
      </div>
      <ProductFilter title='Price'>
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(minPrice) => onChange('minPrice', minPrice)}
          onMaxPriceChange={(maxPrice) => onChange('maxPrice', maxPrice)}
        />
      </ProductFilter>
    </div>
  )
}

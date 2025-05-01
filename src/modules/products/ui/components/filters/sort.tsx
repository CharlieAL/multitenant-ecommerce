'use client'

import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { useFilters } from '~/hooks/use-filters'
import { sortValues } from '~/modules/products/search-params'

export const SortFilter = () => {
  const [filters, setFilters] = useFilters()
  return (
    <div className='flex items-center gap-2'>
      {sortValues.map((sort) => (
        <Button
          key={sort}
          className={cn(
            'rounded-full bg-white hover:bg-white ',
            filters.sort !== sort &&
              'bg-transparent border-transparent hover:border-border hover:bg-transparent'
          )}
          size={'sm'}
          variant={'secondary'}
          onClick={() => setFilters({ sort })}
        >
          <span className='first-letter:uppercase'>{sort}</span>
        </Button>
      ))}
    </div>
  )
}

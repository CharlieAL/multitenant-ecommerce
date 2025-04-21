'use client'
import { ListFilterIcon, SearchIcon } from 'lucide-react'
import { Input } from '~/components/ui/input'

import { CategoriesSidebar } from './categories-sidebar'
import { useState } from 'react'
import { Button } from '~/components/ui/button'

interface SearchInputProps {
  disabled?: boolean
}

export const SearchInput = ({ disabled }: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='flex items-center gap-2 w-full'>
      <CategoriesSidebar isOpen={isOpen} onOpenChange={setIsOpen} />
      <div className='relative w-full'>
        <SearchIcon className='absolute top-1/2 left-3 -translate-y-1/2 size-4 text-neutral-500 ' />
        <Input
          className='pl-8'
          placeholder='Search products'
          disabled={disabled}
        />
      </div>
      <Button
        variant={'elevated'}
        className='size-12 shrink-0 flex lg:hidden'
        onClick={() => setIsOpen(!isOpen)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

import { SubCategoryMenu } from './sub-category-menu'
import { CategoriesGetManyOutput } from '~/modules/categories/types'
import Link from 'next/link'

interface CategoryDropdownProps {
  category: CategoriesGetManyOutput[1]
  isActive?: boolean
  isNavigationHovered?: boolean
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true)
    }
  }
  const onMouseLeave = () => {
    if (category.subcategories) {
      console.log('first')
      setIsOpen(false)
    }
  }

  const onClick = () => {
    if (category.subcategories) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className='relative'>
        <Button
          asChild
          variant={'elevated'}
          className={cn(
            'h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black',
            isActive && !isNavigationHovered && 'bg-white border-primary',
            isOpen &&
              'border-primary bg-w shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] bg-white'
          )}
        >
          <Link prefetch href={`/${category.slug === 'all' ? '' : category.slug}`}>
            {category.name}
          </Link>
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              'opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px]  border-b-[10px]  border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2 ',
              isOpen && 'opacity-100'
            )}
          />
        )}
      </div>
      <SubCategoryMenu category={category} isOpen={isOpen} />
    </div>
  )
}

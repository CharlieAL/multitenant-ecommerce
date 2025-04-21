import { useTRPC } from '~/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { CategoriesGetManyOutput } from '~/modules/categories/types'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

import { ScrollArea } from '~/components/ui/scroll-area'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface CategoriesSidebarProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const CategoriesSidebar = ({ isOpen, onOpenChange }: CategoriesSidebarProps) => {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.categories.getMany.queryOptions())

  const router = useRouter()
  const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoriesGetManyOutput[1] | null>(null)
  const currentCategories = parentCategories ?? data ?? []

  const handleOnOpenChange = (open: boolean) => {
    setParentCategories(null)
    setSelectedCategory(null)
    onOpenChange(open)
  }

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    // Implement category click logic here
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput)
      setSelectedCategory(category)
    } else {
      // This is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        // this is a subcategory - navigate to /category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else {
        // this is a top level category - navigate to /category
        if (category.slug === 'all') {
          router.push('/')
        } else {
          router.push(`/${category.slug}`)
        }
      }
      handleOnOpenChange(false)
    }
  }

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null)
      setSelectedCategory(null)
    }
  }

  const backgroundColor = selectedCategory?.color || 'white'
  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        className='p-0 transition-none'
        side='left'
        style={{
          backgroundColor
        }}
      >
        <SheetHeader className='p-4 border-b  h-20'>
          <SheetTitle className='text-5xl font-semibold'>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2'>
          {parentCategories && (
            <button
              className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'
              onClick={handleBackClick}
            >
              <ChevronLeftIcon className='size-4 mr-2' />
              back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium'
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className='size-4 ml-2' />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

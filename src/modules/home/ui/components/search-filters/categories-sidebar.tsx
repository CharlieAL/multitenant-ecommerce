import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '~/components/ui/sheet'

import { CustomCategory } from '~/modules/categories/types'

interface CategoriesSidebarProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  data: CustomCategory[] // TODO: delete this later
}

export const CategoriesSidebar = ({
  isOpen,
  onOpenChange,
  data
}: CategoriesSidebarProps) => {
  const router = useRouter()
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null)
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null)
  const currentCategories = parentCategories ?? data ?? []

  const handleOnOpenChange = (open: boolean) => {
    setParentCategories(null)
    setSelectedCategory(null)
    onOpenChange(open)
  }

  const handleCategoryClick = (category: CustomCategory) => {
    // Implement category click logic here
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[])
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

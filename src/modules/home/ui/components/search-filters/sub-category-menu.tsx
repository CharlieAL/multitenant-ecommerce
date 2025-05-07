import Link from 'next/link'
import { CategoriesGetManyOutput } from '~/modules/categories/types'
import { DEFAULT_BG_COLOR } from '~/modules/home/constants'

interface SubCategoryMenuProps {
  isOpen: boolean
  category: CategoriesGetManyOutput[1]
}

export const SubCategoryMenu = ({ isOpen, category }: SubCategoryMenuProps) => {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null
  }
  const backgroundColor = category.color || DEFAULT_BG_COLOR
  return (
    <div className='absolute top-[100%] left-0 z-100'>
      {/* invisible bridge to maintain hover */}
      <div className='h-3 w-60 bg-transparent' />
      <div
        className='w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  -translate-x-[2px] -translate-y-[2px]'
        style={{ backgroundColor }}
      >
        <div>
          {category.subcategories.map((subCategory) => (
            <Link
              prefetch
              key={subCategory.slug}
              href={`/${category.slug}/${subCategory.slug}`}
              className='w-full text-left  p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium'
            >
              {subCategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

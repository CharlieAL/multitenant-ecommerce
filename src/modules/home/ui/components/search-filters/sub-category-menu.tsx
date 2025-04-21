import Link from 'next/link'
import { CategoriesGetManyOutput } from '~/modules/categories/types'

interface SubCategoryMenuProps {
  isOpen: boolean
  position: {
    top: number
    left: number
  }
  category: CategoriesGetManyOutput[1]
}

export const SubCategoryMenu = ({ isOpen, position, category }: SubCategoryMenuProps) => {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null
  }
  const backgroundColor = category.color || '#f5f5f5'
  return (
    <div
      style={{
        top: position.top,
        left: position.left
      }}
      className='fixed z-100'
    >
      {/* invisible bridge to maintain hover */}
      <div className='h-3 w-60 bg-transparent' />
      <div
        className='w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  -translate-x-[2px] -translate-y-[2px]'
        style={{ backgroundColor }}
      >
        <div>
          {category.subcategories.map((subCategory) => (
            <Link
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

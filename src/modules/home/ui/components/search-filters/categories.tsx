'use client'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { ListFilterIcon } from 'lucide-react'
import { CategoryDropdown } from './category-dropdown'
import { CategoriesSidebar } from './categories-sidebar'
import { CategoriesGetManyOutput } from '~/modules/categories/types'

interface CategoriesProps {
  data: CategoriesGetManyOutput
}

export const Categories = ({ data }: CategoriesProps) => {
  const params = useParams()

  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const categoryParam = params?.category as string | undefined
  const activeCategory = categoryParam || 'all'
  const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory)
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1

  useEffect(() => {
    const caculeteVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const viewAllWidth = viewAllRef.current.offsetWidth
      const availableWidth = containerWidth - viewAllWidth
      const items = Array.from(measureRef.current.children)
      let totalWidth = 0
      let visible = 0

      for (const item of items) {
        const width = item.getBoundingClientRect().width
        if (totalWidth + width > availableWidth) break
        totalWidth += width
        visible++
      }
      setVisibleCount(visible)
    }
    const resizeObserver = new ResizeObserver(caculeteVisible)
    resizeObserver.observe(containerRef.current!)
    return () => resizeObserver.disconnect()
  }, [data.length])

  return (
    <div className='relative w-full'>
      {/* hidden div to measure items */}
      <CategoriesSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div
        ref={measureRef}
        className='absolute opacity-0 pointer-events-none flex'
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px'
        }}
      >
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
      {/* visible items */}
      <div
        ref={containerRef}
        className='flex flex-nowrap items-center'
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className='shrink-0'>
          <Button
            variant={'elevated'}
            className={cn(
              'h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black',
              isActiveCategoryHidden && !isAnyHovered && 'bg-white border-primary'
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className=' ml-2' />
          </Button>
        </div>
      </div>
    </div>
  )
}

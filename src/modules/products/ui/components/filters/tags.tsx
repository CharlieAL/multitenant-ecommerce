import { useTRPC } from '~/trpc/client'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Checkbox } from '~/components/ui/checkbox'

import { DEFAULT_TAGS_LIMIT } from '~/constants'
import { LoaderIcon } from 'lucide-react'

interface TagsFilterProps {
  value?: string[] | null
  onChange: (value: string[]) => void
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC()
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.tags.getMany.infiniteQueryOptions(
      { limit: DEFAULT_TAGS_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
        }
      }
    )
  )
  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag) || [])
    } else {
      onChange([...(value || []), tag])
    }
  }
  return (
    <div className='flex flex-col gap-y-2'>
      {isLoading ? (
        <div className='flex items-center justify-center p-4'>
          <LoaderIcon className='animate-spin size-4' />
        </div>
      ) : (
        <div>
          {data?.pages
            .flatMap((page) => page.docs)
            .map((tag) => (
              <div
                key={tag.id}
                className='flex items-center justify-between cursor-pointer py-1'
                onClick={() => onClick(tag.name)}
              >
                <p className='font-medium first-letter:uppercase'>{tag.name}</p>
                <Checkbox
                  className='size-5'
                  checked={value?.includes(tag.name)}
                  onCheckedChange={() => onClick(tag.name)}
                />
              </div>
            ))}
        </div>
      )}
      {hasNextPage && !isFetchingNextPage && (
        <button
          disabled={isFetchingNextPage}
          className='underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer'
          onClick={() => {
            fetchNextPage()
          }}
        >
          Load more
        </button>
      )}
    </div>
  )
}

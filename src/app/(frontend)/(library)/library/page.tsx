export const dynamic = 'force-dynamic'

import { getQueryClient, trpc } from '~/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { LibraryView } from '~/modules/library/ui/views/library-view'
import { DEFAULT_LIBRARY_LIMIT } from '~/constants'

const LibraryPage = async () => {
  const queryClient = getQueryClient()

  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIBRARY_LIMIT
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  )
}
export default LibraryPage

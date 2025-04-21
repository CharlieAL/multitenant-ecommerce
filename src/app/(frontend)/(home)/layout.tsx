import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { Footer } from '~/modules/home/ui/components/footer'
import { Navbar } from '~/modules/home/ui/components/navbar'
import { SearchFilters } from '~/modules/home/ui/components/search-filters'
import { getQueryClient, trpc } from '~/trpc/server'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchFilters />
      </HydrationBoundary>
      <div className='flex-1 bg-[#f4f4f4]'>{children}</div>
      <Footer />
    </div>
  )
}
export default Layout

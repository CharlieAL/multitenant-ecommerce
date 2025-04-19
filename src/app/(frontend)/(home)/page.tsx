// its a just testing file for trpc

'use client'

import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'

const HomePage = () => {
  const trpc = useTRPC()

  const categories = useQuery(trpc.categories.getMany.queryOptions())

  console.log(categories.data)
  return (
    <main className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-4'>Welcome to Funroad</h1>
      <p>
        Hello world! Your ecommerce journey starts here. is Loading?: --{' '}
        {categories.isLoading}
      </p>
      {categories.isLoading}
      {JSON.stringify(categories.data)}
    </main>
  )
}

export default HomePage

import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/client'

export const useAuth = () => {
  const trpc = useTRPC()
  const session = useQuery(trpc.auth.session.queryOptions())

  return {
    user: session.data?.user,
    isLoading: session.isLoading,
    isAuthenticated: session.data?.user !== null && session.data?.user !== undefined
  }
}

import { useQueryStates } from 'nuqs'
import { params } from '~/modules/products/search-params'

export const useFilters = () => {
  return useQueryStates(params)
}

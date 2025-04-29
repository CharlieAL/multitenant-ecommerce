import { parseAsString, useQueryStates } from 'nuqs'

export const useFilters = () => {
  return useQueryStates({
    minPrice: parseAsString.withOptions({
      clearOnDefault: true
    }),
    maxPrice: parseAsString.withOptions({
      clearOnDefault: true
    })
  })
}

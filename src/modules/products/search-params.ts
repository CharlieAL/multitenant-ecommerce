import { parseAsString, createLoader, parseAsArrayOf, parseAsStringLiteral } from 'nuqs/server'

export const sortValues = ['curated', 'trending', 'hot & new'] as const

export const params = {
  sort: parseAsStringLiteral(sortValues).withDefault('curated').withOptions({
    clearOnDefault: true
  }),
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true
    })
    .withDefault(''),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true
    })
    .withDefault(''),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true
    })
    .withDefault([])
}
export const loadFilters = createLoader(params)

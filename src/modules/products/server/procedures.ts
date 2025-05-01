import { z } from 'zod'
import type { Sort, Where } from 'payload'
import { baseProcedure, createTRPCRouter } from '~/trpc/init'
import { Category } from '~/payload-types'
import { sortValues } from '../search-params'

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().optional().nullable(),
        minPrice: z.string().optional().nullable(),
        maxPrice: z.string().optional().nullable(),
        tags: z.array(z.string()).optional().nullable(),
        sort: z.enum(sortValues).optional().nullable()
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {}

      let sort: Sort = '-createdAt'

      if (input.sort === 'hot & new') {
        sort = 'name'
      }

      if (input.sort === 'trending') {
        sort = '+createdAt'
      }

      if (input.minPrice) {
        where.price = {
          ...where.price,
          greater_than_equal: Number(input.minPrice)
        }
      }

      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: Number(input.maxPrice)
        }
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: 'categories',
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category
            }
          }
        })

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category),
            subcategories: undefined
          }))
        }))
        const subcategoriesSlugs = []
        const parentCategory = formattedData[0]

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
          )
          where['category.slug'] = {
            in: [parentCategory.slug, ...subcategoriesSlugs]
          }
        }
      }

      if (input.tags && input.tags.length > 0) {
        where['tag.name'] = {
          in: input.tags
        }
      }

      const data = await ctx.db.find({
        collection: 'products',
        depth: 1,
        where,
        sort
      })

      return data
    })
})

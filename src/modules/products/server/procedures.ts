import { z } from 'zod'
import type { Sort, Where } from 'payload'
import { baseProcedure, createTRPCRouter } from '~/trpc/init'
import type { Category, Media, Tenant } from '~/payload-types'
import { sortValues } from '../search-params'
import { DEFAULT_PRODUCTS_LIMIT } from '~/constants'

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1), // <-- "cursor" needs to exist, but can be any type
        limit: z.number().default(DEFAULT_PRODUCTS_LIMIT),
        category: z.string().optional().nullable(),
        minPrice: z.string().optional().nullable(),
        maxPrice: z.string().optional().nullable(),
        tags: z.array(z.string()).optional().nullable(),
        sort: z.enum(sortValues).optional().nullable(),
        tenantSlug: z.string().optional().nullable()
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

      if (input.tenantSlug) {
        where['tenant.slug'] = {
          equals: input.tenantSlug
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
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit
      })

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})

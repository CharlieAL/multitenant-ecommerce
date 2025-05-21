import { z } from 'zod'

import { DEFAULT_LIBRARY_LIMIT } from '~/constants'

import { createTRPCRouter, protectedProcedure } from '~/trpc/init'
import type { Media, Tenant } from '~/payload-types'

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1), // <-- "cursor" needs to exist, but can be any type
        limit: z.number().default(DEFAULT_LIBRARY_LIMIT)
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: 'orders',
        depth: 0,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id
          }
        }
      })

      const productsIds = ordersData.docs.map(doc => doc.product)

      const productsData = await ctx.db.find({
        collection: 'products',
        pagination: false,
        where: {
          id: {
            in: productsIds
          }
        }
      })

      return {
        ...productsData,
        docs: productsData.docs.map(doc => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})

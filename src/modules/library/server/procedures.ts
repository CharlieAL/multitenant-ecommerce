import { z } from 'zod'

import { DEFAULT_LIBRARY_LIMIT } from '~/constants'

import { createTRPCRouter, protectedProcedure } from '~/trpc/init'
import type { Media, Tenant } from '~/payload-types'
import { TRPCError } from '@trpc/server'

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: 'orders',
        pagination: false,
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId
              }
            },
            {
              user: {
                equals: ctx.session.user.id
              }
            }
          ]
        }
      })

      const order = ordersData.docs[0]
      if (!order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found'
        })
      }

      const product = await ctx.db.findByID({
        collection: 'products',
        id: input.productId,
        disableErrors: true
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        })
      }

      return {
        ...product,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null }
      }
    }),
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

      const productsIds = ordersData.docs.map((doc) => doc.product)

      const productsData = await ctx.db.find({
        collection: 'products',
        pagination: false,
        where: {
          id: {
            in: productsIds
          }
        }
      })
      const dataWithSummarizedReviews = await Promise.all(
        productsData.docs.map(async (doc) => {
          const reviewsData = await ctx.db.find({
            collection: 'reviews',
            pagination: false,
            where: {
              product: {
                equals: doc.id
              }
            }
          })
          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) /
                  reviewsData.totalDocs
          }
        })
      )

      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})

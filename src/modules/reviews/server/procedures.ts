import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '~/trpc/init'
import { createReviewSchema } from '../schema'

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: 'products',
        id: input.productId
      })

      if (!product) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      }

      const reviewsData = await ctx.db.find({
        collection: 'reviews',
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
                equals: product.id
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

      const review = reviewsData.docs[0]

      return review || null
    }),
  create: protectedProcedure.input(createReviewSchema).mutation(async ({ ctx, input }) => {
    const product = await ctx.db.findByID({
      collection: 'products',
      id: input.productId,
      disableErrors: true
    })
    if (!product) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
    }

    const existingReview = await ctx.db.find({
      collection: 'reviews',
      limit: 1,
      pagination: false,
      where: {
        and: [
          {
            product: {
              equals: product.id
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
    if (existingReview.docs.length > 0) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'You already reviewed this product' })
    }
    const review = await ctx.db.create({
      collection: 'reviews',
      data: {
        product: product.id,
        user: ctx.session.user.id,
        rating: input.rating,
        description: input.description
      }
    })
    return review
  }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: 'Rating is requierd' }).max(5),
        description: z
          .string()
          .min(10, { message: 'Description is requierd at least 10 characters' })
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReview = await ctx.db.findByID({
        depth: 0, // existingReview.user will be User ID
        collection: 'reviews',
        id: input.reviewId,
        disableErrors: true
      })
      if (!existingReview) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Review not found' })
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to update this review'
        })
      }
      const updatedReview = await ctx.db.update({
        collection: 'reviews',
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description
        }
      })
      return updatedReview
    })
})

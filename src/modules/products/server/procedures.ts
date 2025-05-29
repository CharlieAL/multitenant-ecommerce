import { z } from 'zod'
import type { Sort, Where } from 'payload'

import { headers as getHeaders } from 'next/headers'

import { sortValues } from '../search-params'
import { DEFAULT_PRODUCTS_LIMIT } from '~/constants'

import { baseProcedure, createTRPCRouter } from '~/trpc/init'
import type { Category, Media, Tenant } from '~/payload-types'
import { TRPCError } from '@trpc/server'

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders()
      const session = await ctx.db.auth({ headers })

      const product = await ctx.db.findByID({
        collection: 'products',
        disableErrors: true,
        id: input.id,
        select: {
          content: false
        }
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        })
      }

      if (product.isArchived) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        })
      }

      let isPurchased = false
      if (session.user) {
        const orderData = await ctx.db.find({
          collection: 'orders',
          pagination: false,
          disableErrors: true,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: product.id
                }
              },
              {
                user: {
                  equals: session.user.id
                }
              }
            ]
          }
        })
        isPurchased = !!orderData.docs[0]
      }

      const reviewsData = await ctx.db.find({
        collection: 'reviews',
        pagination: false,
        where: {
          product: {
            equals: product.id
          }
        }
      })

      const reviewRating =
        reviewsData.docs.length === 0
          ? 0
          : reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.totalDocs

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }

      if (reviewsData.docs.length > 0) {
        reviewsData.docs.forEach((review) => {
          const rating = review.rating
          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
          }
        })
        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key)
          const count = ratingDistribution[rating] || 0
          ratingDistribution[rating] = Math.round((count / reviewsData.totalDocs) * 100)
        })
      }

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviewsData.totalDocs,
        ratingDistribution
      }
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1), // <-- "cursor" needs to exist, but can be any type
        limit: z.number().default(DEFAULT_PRODUCTS_LIMIT),
        category: z.string().optional().nullish(),
        minPrice: z.string().optional().nullish(),
        maxPrice: z.string().optional().nullish(),
        tags: z.array(z.string()).optional().nullish(),
        sort: z.enum(sortValues).optional().nullish(),
        tenantSlug: z.string().optional().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: {
          not_equals: true
        }
      }

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
      } else {
        where['isPrivate'] = {
          not_equals: true
        }
      }

      if (input.category) {
        console.log('first')
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

        if (!parentCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found'
          })
        }
        subcategoriesSlugs.push(
          ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
        )
        where['category.slug'] = {
          in: [parentCategory.slug, ...subcategoriesSlugs]
        }
      }

      if (input.tags && input.tags.length > 0) {
        where['tag.name'] = {
          in: input.tags
        }
      }

      const products = await ctx.db.find({
        collection: 'products',
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false
        }
      })

      const productsWithSummarizedReviews = await Promise.all(
        products.docs.map(async (doc) => {
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
        ...products,
        docs: productsWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})

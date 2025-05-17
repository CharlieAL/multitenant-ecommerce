import { z } from 'zod'

import { baseProcedure, createTRPCRouter, protectedProcedure } from '~/trpc/init'

import type { Media, Tenant } from '~/payload-types'
import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'
import { CheckoutMetaData, ProductMetaData } from '../types'
import { stripe } from '~/lib/stripe'

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productsIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: 'products',
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productsIds
              }
            },
            {
              'tenant.slug': {
                equals: input.tenantSlug
              }
            }
          ]
        }
      })

      if (products.totalDocs !== input.productsIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Products not found'
        })
      }

      const tenantsData = await ctx.db.find({
        collection: 'tenants',
        pagination: false,
        limit: 1,
        where: {
          slug: {
            equals: input.tenantSlug
          }
        }
      })
      const tenant = tenantsData.docs[0] as Tenant & { image: Media | null }

      if (!tenant) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tenant not found'
        })
      }

      // throw error if stripe details not submitted

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map(
        (product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100, // stripe handles in cents
            currency: 'usd',
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price
              } as ProductMetaData
            }
          }
        })
      )

      const checkout = await stripe.checkout.sessions.create({
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
        mode: 'payment',
        line_items: lineItems,
        invoice_creation: {
          enabled: true
        },
        metadata: {
          userId: ctx.session.user.id
        } as CheckoutMetaData
      })

      if (!checkout.url) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session'
        })
      }
      return {
        url: checkout.url
      }
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string())
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: 'products',
        depth: 1,
        where: {
          id: {
            in: input.ids
          }
        }
      })

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found'
        })
      }

      return {
        ...data,
        totalPrice: data.docs.reduce((acc, doc) => acc + doc.price, 0),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null }
        }))
      }
    })
})

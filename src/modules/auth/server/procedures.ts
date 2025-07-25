import { headers as getHeaders } from 'next/headers'
import { baseProcedure, createTRPCRouter } from '~/trpc/init'

import { TRPCError } from '@trpc/server'

import { loginSchema, registerSchema } from '../schemas'
import { deleteAuthCookie, generateAuthCookie } from '../utils'
import { stripe } from '~/lib/stripe'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.db.auth({ headers })
    return session
  }),
  register: baseProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const existingData = await ctx.db.find({
      collection: 'users',
      limit: 1,
      where: {
        username: {
          equals: input.username
        }
      }
    })

    const existingUser = existingData.docs[0]
    if (existingUser) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Username already taken' })
    }

    const account = await stripe.accounts.create({})

    if (!account) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Stripe account creation failed' })
    }

    const tenant = await ctx.db.create({
      collection: 'tenants',
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: account.id
      }
    })

    await ctx.db.create({
      collection: 'users',
      data: {
        email: input.email,
        username: input.username,
        password: input.password, //this will be hashed by Payload internally
        tenants: [{ tenant: tenant.id }]
      }
    })

    const data = await ctx.db.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password
      }
    })
    if (!data.token) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' })
    }

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token
    })

    return data
  }),
  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password
      }
    })
    if (!data.token) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' })
    }

    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token
    })

    return data
  }),
  logout: baseProcedure.mutation(async ({ ctx }) => {
    await deleteAuthCookie({
      prefix: ctx.db.config.cookiePrefix
    })
    return { success: true }
  })
})

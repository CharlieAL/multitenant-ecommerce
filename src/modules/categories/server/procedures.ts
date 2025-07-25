import { TRPCError } from '@trpc/server'
import { Category } from '~/payload-types'
import { baseProcedure, createTRPCRouter } from '~/trpc/init'

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: 'categories',
      disableErrors: true,
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false
        }
      },
      sort: 'name'
    })

    if (!data.docs.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No categories found'
      })
    }
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category)
      }))
    }))
    return formattedData
  })
})

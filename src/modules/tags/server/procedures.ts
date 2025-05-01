import { z } from 'zod'
import { DEFAULT_TAGS_LIMIT } from '~/constants'
import { baseProcedure, createTRPCRouter } from '~/trpc/init'

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_TAGS_LIMIT)
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: 'tags',
        depth: 1,
        page: input.cursor,
        limit: input.limit
      })

      return data
    })
})

import { categoriesRouter } from '~/modules/categories/server/procedures'

import { authRouter } from '~/modules/auth/server/procedures'
import { createTRPCRouter } from '../init'
export const appRouter = createTRPCRouter({
  auth: authRouter,
  categories: categoriesRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

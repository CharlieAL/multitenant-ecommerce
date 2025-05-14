import { categoriesRouter } from '~/modules/categories/server/procedures'

import { authRouter } from '~/modules/auth/server/procedures'
import { createTRPCRouter } from '../init'
import { productsRouter } from '~/modules/products/server/procedures'
import { tagsRouter } from '~/modules/tags/server/procedures'
import { tenantsRouter } from '~/modules/tenants/server/procedure'
export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  auth: authRouter,
  tenants: tenantsRouter,
  products: productsRouter,
  categories: categoriesRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

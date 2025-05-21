import { tagsRouter } from '~/modules/tags/server/procedures'
import { authRouter } from '~/modules/auth/server/procedures'
import { libraryRouter } from '~/modules/library/server/procedures'
import { tenantsRouter } from '~/modules/tenants/server/procedure'
import { checkoutRouter } from '~/modules/checkout/server/procedures'
import { productsRouter } from '~/modules/products/server/procedures'
import { categoriesRouter } from '~/modules/categories/server/procedures'

import { createTRPCRouter } from '../init'

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  auth: authRouter,
  library: libraryRouter,
  tenants: tenantsRouter,
  checkout: checkoutRouter,
  products: productsRouter,
  categories: categoriesRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

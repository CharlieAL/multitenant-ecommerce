import { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/trpc/routers/_app'

export type ProductosGetManyOutput = inferRouterOutputs<AppRouter>['products']['getMany']

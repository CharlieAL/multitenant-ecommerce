import { baseProcedure, createTRPCRouter } from '~/trpc/init'
import configPromise from '@payload-config'
import { Category } from '~/payload-types'
import { getPayload } from 'payload'
export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const payload = await getPayload({
      config: configPromise
    })
    const data = await payload.find({
      collection: 'categories',
      depth: 1,
      where: {
        parent: {
          equals: false
        }
      }
    })
    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((subdocs) => ({
        // Because of 'depth: 1' we are confident doc will be a type of "Category"
        ...(subdocs as Category),
        subcategories: undefined
      }))
    }))
    return formattedData
  })
})

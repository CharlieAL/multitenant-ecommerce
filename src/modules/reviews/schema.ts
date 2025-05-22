import { z } from 'zod'

export const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1, { message: 'Rating is requierd' }).max(5),
  description: z.string().min(10, { message: 'Description is requierd at least 10 characters' })
})

import { ReviewGetOneOutput } from '~/modules/reviews/types'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { useTRPC } from '~/trpc/client'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { createReviewSchema } from '~/modules/reviews/schema'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { StarPicker } from '~/components/star-picker'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ReviewFormProps {
  productId: string
  initalData?: ReviewGetOneOutput
}

export const ReviewForm = ({ productId, initalData }: ReviewFormProps) => {
  const [isPreview, setIsPreview] = useState(!!initalData)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({ productId }))
        setIsPreview(true)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({ productId }))
        setIsPreview(true)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  )

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      productId: productId,
      description: initalData?.description ?? '',
      rating: initalData?.rating ?? 0
    }
  })

  const onSubmit = async (values: z.infer<typeof createReviewSchema>) => {
    if (initalData) {
      updateReview.mutate({
        reviewId: initalData.id,
        description: values.description,
        rating: values.rating
      })
    } else {
      createReview.mutate(values)
    }
  }
  return (
    <Form {...form}>
      <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <p className='font-medium'>{isPreview ? 'Your rating:' : 'Liked it? Give it a rating'}</p>
        <FormField
          control={form.control}
          name='rating'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker {...field} disabled={isPreview} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={'Tell us what you think about this product'}
                  disabled={isPreview}
                  className='resize-none'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isPreview && (
          <Button
            disabled={createReview.isPending || updateReview.isPending}
            variant={'elevated'}
            size='lg'
            type='submit'
            className='bg-black text-white hover:bg-pink-400 hover:text-primary w-fit'>
            {initalData ? 'Update review' : 'Post review'}
          </Button>
        )}
        {isPreview && (
          <Button
            variant={'elevated'}
            size='lg'
            type='button'
            className=' w-fit'
            onClick={() => setIsPreview(false)}>
            Edit review
          </Button>
        )}
      </form>
    </Form>
  )
}

export const ReviewFormSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <p className='font-medium'>Your rating:</p>
      <div className='h-6'>
        <div className='animate-pulse bg-gray-200 h-full w-32 rounded' />
      </div>
      <div className='h-32'>
        <div className='animate-pulse bg-gray-200 h-full w-full rounded' />
      </div>
      <div className='h-10 w-32'>
        <div className='animate-pulse bg-gray-200 h-full w-full rounded' />
      </div>
    </div>
  )
}

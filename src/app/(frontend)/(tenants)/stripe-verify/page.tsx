'use client'

import { useMutation } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useTRPC } from '~/trpc/client'

// interface StripeVerifyPageProps {}

const StripeVerifyPage = () => {
  const trpc = useTRPC()
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.url
      },
      onError: (error) => {
        console.log(error.message, 'error')
        toast.error(error.message)
      }
    })
  )

  useEffect(() => {
    verify()
  }, [verify])
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white rounded-md'>
        <LoaderIcon className='animate-spin' />
        <p className='text-base font-medium'>Verifying your account... please wait</p>
      </div>
    </div>
  )
}
export default StripeVerifyPage

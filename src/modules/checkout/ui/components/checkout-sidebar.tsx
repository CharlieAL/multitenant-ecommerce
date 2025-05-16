import { CircleXIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { formatCurrency } from '~/lib/utils'

interface CheckoutSidebarProps {
  totalPrice: number
  onCheckout: () => void
  isCanceled: boolean
  isPending: boolean
}

export const CheckoutSidebar = ({
  totalPrice,
  onCheckout,
  isCanceled,
  isPending
}: CheckoutSidebarProps) => {
  return (
    <div className='border rounded-md overflow-hidden bg-white flex flex-col'>
      <div className='flex items-center justify-between p-4 border-b'>
        <h4 className='font-medium text-lg'>Total</h4>
        <p className='font-medium text-lg'>{formatCurrency(totalPrice)}</p>
      </div>
      <div className='p-4 flex items-center justify-center'>
        <Button
          className='text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary'
          variant={'elevated'}
          disabled={isPending}
          onClick={onCheckout}
          size={'lg'}
        >
          Checkout
        </Button>
      </div>
      {isCanceled && (
        <div className='p-4 felx justify-center items-center border-t'>
          <div className='bg-red-100 border border-red-400 font-medium px-4 py-3 rounded flex items-center w-full'>
            <CircleXIcon className='size-6 mr-2 fill-red-500 text-red-100' />
            <span>Checkout failed. Please Try again.</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const CheckoutSidebarSkeleton = () => {
  return (
    <div className='border rounded-md overflow-hidden bg-white flex flex-col'>
      <div className='flex items-center justify-between p-4 border-b'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-16' />
      </div>
      <div className='p-4 flex items-center justify-center'>
        <Button
          className='text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary'
          variant={'elevated'}
          disabled
          size={'lg'}
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}

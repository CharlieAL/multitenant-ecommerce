'use client'

import Link from 'next/link'
import { genereteTenantURL } from '~/lib/utils'

import { Button } from '~/components/ui/button'

interface NavbarProps {
  slug: string
}

export const Navbar = ({ slug }: NavbarProps) => {
  return (
    <nav className='h-20 font-medium bg-white border-b'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12'>
        <Link href={genereteTenantURL(slug)} className='flex items-center gap-2'>
          <p className='text-xl'>Checkout</p>
        </Link>
        <Button asChild variant={'elevated'}>
          <Link href={genereteTenantURL(slug)}>Continue Shopping</Link>
        </Button>
      </div>
    </nav>
  )
}

export const NavbarSkeleton = () => {
  return (
    <nav className='h-20 font-medium bg-white border-b'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-baseline items-center h-full px-4 lg:px-12'>
        <p className='text-xl'>Tenant</p>
      </div>
    </nav>
  )
}

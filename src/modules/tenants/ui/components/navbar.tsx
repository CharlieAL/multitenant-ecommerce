'use client'

import dynamic from 'next/dynamic'

import { useSuspenseQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { genereteTenantURL } from '~/lib/utils'
import { useTRPC } from '~/trpc/client'

import { Button } from '~/components/ui/button'
import { ShoppingCartIcon } from 'lucide-react'

const CheckoutButton = dynamic(
  () =>
    import('~/modules/checkout/ui/components/checkout-button').then((mod) => mod.CheckoutButton),
  {
    ssr: false,
    loading: () => (
      <Button className={'bg-white'} disabled>
        <ShoppingCartIcon className='text-black' />
      </Button>
    )
  }
)

interface NavbarProps {
  slug: string
}

export const Navbar = ({ slug }: NavbarProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }))
  return (
    <nav className='h-20 font-medium bg-white border-b'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12'>
        <Link href={genereteTenantURL(slug)} className='flex items-center gap-2'>
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              alt={data.name + ' profile picture'}
              className='rounded-full border shrink-0 size-[32px]'
            />
          )}
          <p className='text-xl'>{data.name}</p>
        </Link>
        <CheckoutButton tanantSlug={slug} hideIfEmpty />
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

'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '~/lib/utils'
import { Logo } from '~/components/logo'
import { Button } from '~/components/ui/button'
import { MenuIcon } from 'lucide-react'
import { NavbarSidebar } from './navbar-sidebar'
import { useAuth } from '~/hooks/use-auth'

interface NavbarItemsProps {
  href: string
  children: React.ReactNode
  isActive?: boolean
}

const NavbarItem = ({ href, children, isActive }: NavbarItemsProps) => {
  return (
    <Button
      asChild
      className={cn(
        'bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg',
        isActive && 'bg-black text-white hover:bg-black hover:text-white'
      )}
      variant={'outline'}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

const navbarItems = [
  {
    href: '/',
    children: 'Home'
  },
  {
    href: '/about',
    children: 'About'
  },
  {
    href: '/features',
    children: 'Features'
  },
  {
    href: '/pricing',
    children: 'Pricing'
  },
  {
    href: '/contact',
    children: 'Contact'
  }
]

export const Navbar = () => {
  const path = usePathname()

  const { isAuthenticated, isLoading } = useAuth()

  const [open, setOpen] = useState(false)
  return (
    <div className='h-20 flex border-b justify-between font-medium bg-white '>
      <div className='flex items-center pl-4'>
        <Logo />
      </div>
      <NavbarSidebar items={navbarItems} open={open} onOpenChange={setOpen} />
      <div className='items-center gap-4 hidden lg:flex'>
        {navbarItems.map((item) => (
          <NavbarItem key={item.href} href={item.href} isActive={path === item.href}>
            {item.children}
          </NavbarItem>
        ))}
      </div>
      {!isLoading && isAuthenticated ? (
        <div className='hidden lg:flex'>
          <Button
            asChild
            className='border-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg border-l'
          >
            <Link href={'/admin'}>Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className='hidden lg:flex'>
          <Button
            asChild
            variant={'secondary'}
            className=' border-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg border-l'
          >
            <Link prefetch href={'/sign-in'}>
              Login
            </Link>
          </Button>
          <Button
            asChild
            className='border-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg border-l'
          >
            <Link prefetch href={'/sign-up'}>
              Start selling
            </Link>
          </Button>
        </div>
      )}
      <div className='lg:hidden flex items-center justify-center pr-4'>
        <Button
          className='bg-transparent hover:bg-transparent rounded-full  border-primary  px-3.5 text-lg'
          variant={'ghost'}
          onClick={() => setOpen(!open)}
        >
          <MenuIcon className='size-5' />
        </Button>
      </div>
    </div>
  )
}

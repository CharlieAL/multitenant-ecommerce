import Link from 'next/link'
import { Logo } from '~/components/logo'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { useAuth } from '~/hooks/use-auth'

interface NavbarItem {
  href: string
  children: React.ReactNode
}

interface NavbarSidebarProps {
  items: NavbarItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NavbarSidebar = ({ items, open, onOpenChange }: NavbarSidebarProps) => {
  const { isAuthenticated } = useAuth()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='left' className='p-0 transition-none'>
        <SheetHeader className='p-4 border-b h-20 '>
          <div className='flex items-center'>
            <SheetTitle className=''>
              <Logo />
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2 pt-0 mt-0'>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='w-full text-left p-4 hover:text-white hover:bg-black flex items-center font-medium text-base mt-0'
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className='border-t'>
            {isAuthenticated ? (
              <Link
                href={'/admin'}
                className='w-full text-left p-4 hover:text-white hover:bg-black flex items-center font-medium text-base mt-0'
                onClick={() => onOpenChange(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  prefetch
                  href={'/sign-in'}
                  className='w-full text-left p-4 hover:text-white hover:bg-black flex items-center font-medium text-base mt-0'
                  onClick={() => onOpenChange(false)}
                >
                  Log in
                </Link>
                <Link
                  prefetch
                  href={'/sign-up'}
                  className='w-full text-left p-4 hover:text-white hover:bg-black flex items-center font-medium text-base mt-0'
                  onClick={() => onOpenChange(false)}
                >
                  Start selling
                </Link>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

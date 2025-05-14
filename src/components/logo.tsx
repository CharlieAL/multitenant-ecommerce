import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { cn } from '~/lib/utils'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700']
})

interface LogoProps {
  className?: string
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href={'/'} className=''>
      <span className={cn('text-5xl font-semibold', poppins.className, className)}>funroad</span>
    </Link>
  )
}

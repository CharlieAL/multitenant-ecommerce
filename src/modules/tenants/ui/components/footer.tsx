import { Logo } from '~/components/logo'

export const Footer = () => {
  return (
    <footer className='h-20 font-medium bg-white border-t'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex gap-2 items-center h-full px-4 lg:px-12'>
        <p className=''>Powered by</p>
        <Logo className='text-2xl font-semibold' />
      </div>
    </footer>
  )
}

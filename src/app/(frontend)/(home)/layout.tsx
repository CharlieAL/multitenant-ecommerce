import { Footer } from '~/modules/home/ui/components/footer'
import { Navbar } from '~/modules/home/ui/components/navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-1 bg-[#f4f4f4]'>{children}</div>
      <Footer />
    </div>
  )
}
export default Layout

import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { TRPCReactProvider } from '~/trpc/client'
import { Toaster } from '~/components/ui/sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const geistSans = DM_Sans({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Funroad',
  description: 'Funroad - A place to share your creations with the world around you.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.className} antialiased`}>
        <NuqsAdapter>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}

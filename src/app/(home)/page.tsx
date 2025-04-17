import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Funroad',
  description: 'Welcome to Funroad - your multitenant ecommerce solution'
}

const HomePage = () => {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Funroad</h1>
      <p>Hello world! Your ecommerce journey starts here.</p>
    </main>
  )
}

export default HomePage

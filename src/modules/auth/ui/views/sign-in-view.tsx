'use client'

import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTRPC } from '~/trpc/client'
import { loginSchema } from '../../schemas'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Logo } from '~/components/logo'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export const SignInView = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: async ({ user }) => {
        toast.success(`Welcome ${user.username}`)
        // navigate to home page
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push('/')
      },
      onError: (error) => {
        toast.error(error.message)
        console.log(error.message)
      }
    })
  )

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login.mutate(values)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-5'>
      <div className='bg-[#f4f4f0] h-screen w-full md:col-span-3 overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8 p-4 lg:p-16'>
            <div className='flex items-center justify-between mb-8'>
              <Logo />
              <Button asChild variant={'link'} size={'sm'} className='border-none' type='button'>
                <Link prefetch href={'sign-up'}>
                  Sign up
                </Link>
              </Button>
            </div>
            <h1 className='text-4xl font-medium'>Welcome back! to funroad</h1>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={login.isPending}
              type='submit'
              className='bg-black  text-white hover:bg-pink-400 hover:text-primary'
              variant={'elevated'}
              size={'lg'}
            >
              Log in
            </Button>
          </form>
        </Form>
      </div>
      <div
        className='h-screen w-full md:col-span-2 hidden md:block'
        style={{
          backgroundImage: `url('/auth-background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  )
}

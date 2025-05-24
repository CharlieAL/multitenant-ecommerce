'use client'

import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cn } from '~/lib/utils'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useTRPC } from '~/trpc/client'
import { registerSchema } from '../../schemas'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Logo } from '~/components/logo'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export const SignUpView = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: async ({ user }) => {
        toast.success(`Welcome ${user.username}`)
        // navigate to home page
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
        router.push('/')
      },
      onError: error => {
        toast.error(error.message)
        console.log(error.message)
      }
    })
  )

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      username: ''
    }
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register.mutate(values)
  }

  const username = form.watch('username')
  const usernameError = form.formState.errors.username

  const showPreview = username && !usernameError
  return (
    <div className='grid grid-cols-1 md:grid-cols-5'>
      <div className='bg-[#f4f4f0] h-screen w-full md:col-span-3 overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8 p-4 lg:p-16'>
            <div className='flex items-center justify-between mb-8'>
              <Logo />
              <Button asChild variant={'link'} size={'sm'} className='border-none' type='button'>
                <Link prefetch href={'sign-in'}>
                  Sign in
                </Link>
              </Button>
            </div>
            <h1 className='text-4xl font-medium'>
              Join over 1,000+ creators and start building your own store
            </h1>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Username</FormLabel>
                  <FormControl>
                    <Input {...field} type='name' />
                  </FormControl>
                  <FormDescription className={cn('hidden', showPreview && 'block')}>
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>.shop.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
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
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={register.isPending}
              type='submit'
              className='bg-black  text-white hover:bg-pink-400 hover:text-primary'
              variant={'elevated'}
              size={'lg'}>
              Create your store
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

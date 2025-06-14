'server-only'
import { cookies as getCookies } from 'next/headers'

interface Props {
  prefix: string
  value: string
}

export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const cookies = await getCookies()
  cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    secure: process.env.NODE_ENV === 'production'
  })
}

interface PropsDelete {
  prefix: string
}
export const deleteAuthCookie = async ({ prefix }: PropsDelete) => {
  const cookies = await getCookies()
  cookies.delete(`${prefix}-token`)
}

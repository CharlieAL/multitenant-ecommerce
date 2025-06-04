import { NextResponse, NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)']
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get('host') || 'localhost:3000'

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, '')
    return NextResponse.rewrite(new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url))
  }

  return NextResponse.next()
}

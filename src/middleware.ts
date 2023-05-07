import { url } from 'inspector'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
export default withAuth(
  async function middleware(req) {
    const pathName = req.nextUrl.pathname

    const isAuth = await getToken({ req })

    const loginPage = pathName.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']
    const isSenssitive = sensitiveRoutes.some((url) => pathName.startsWith(url))

    if (loginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.next()
    }
    if (!isAuth && isSenssitive) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (pathName === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

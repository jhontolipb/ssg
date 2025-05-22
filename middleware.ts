import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session
  const isAuthRoute = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register"

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isAuthRoute && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is authenticated and trying to access an auth route
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}

// Auth Callback Route - Handles email confirmation and password reset tokens
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    // Exchange the token for a session
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // If it's a password recovery or signup, redirect to reset password page
      if (type === 'recovery' || type === 'signup' || type === 'email') {
        return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
      }
      
      // Otherwise redirect to the next URL or home
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // If there's an error, redirect to login with error message
  return NextResponse.redirect(
    new URL('/auth/login?error=Could not verify token', requestUrl.origin)
  )
}


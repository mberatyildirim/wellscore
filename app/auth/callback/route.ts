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
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error && data.user) {
      // For HR signup (type === 'signup' or 'email'), user already set password during registration
      // So redirect to login instead of password reset
      if (type === 'signup' || type === 'email') {
        // Check if user has a profile (means they completed signup)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        
        if (profile) {
          // User already has profile and password, just redirect to login
          return NextResponse.redirect(
            new URL('/auth/login?verified=true&message=Email doğrulandı, giriş yapabilirsiniz', requestUrl.origin)
          )
        }
      }
      
      // For password recovery (employee invitations), redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
      }
      
      // Otherwise redirect to the next URL or home
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // If there's an error, redirect to login with error message
  return NextResponse.redirect(
    new URL('/auth/login?error=Token doğrulanamadı. Lütfen tekrar deneyin.', requestUrl.origin)
  )
}


// API Route: Invite Employee
// Creates employee account and sends invitation email
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, full_name, company_id } = body;

    // Validate inputs
    if (!email || !full_name || !company_id) {
      return NextResponse.json(
        { error: 'Email, ad ve company_id gereklidir' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user (HR admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }

    // Verify HR admin role and company
    const { data: hrProfile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single();

    if (!hrProfile || hrProfile.role !== 'hr_admin' || hrProfile.company_id !== company_id) {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      );
    }

    // Check if employee already exists
    const { data: existingEmployee } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Bu email zaten kayıtlı' },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth with random password
    // Employee will set their own password via password reset email
    const temporaryPassword = Math.random().toString(36).slice(-12) + 'Aa1!';
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: false, // Require email confirmation
      user_metadata: {
        full_name,
        company_id,
      },
    });

    if (authError || !authData.user) {
      console.error('[Auth Create Error]:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Kullanıcı oluşturulamadı' },
        { status: 500 }
      );
    }

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        company_id,
        role: 'employee',
        is_active: true,
      });

    if (profileError) {
      console.error('[Profile Create Error]:', profileError);
      // Cleanup: delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Profil oluşturulamadı' },
        { status: 500 }
      );
    }

    // Send password reset email (invitation)
    // This will allow the employee to set their own password
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (resetError) {
      console.error('[Password Reset Email Error]:', resetError);
      // Don't fail the entire operation if email fails
      // Log it for monitoring
    }

    return NextResponse.json({
      success: true,
      message: 'Çalışan başarıyla davet edildi',
      employee: {
        id: authData.user.id,
        email,
        full_name,
      },
    });

  } catch (error: any) {
    console.error('[Invite Employee API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Sunucu hatası' },
      { status: 500 }
    );
  }
}


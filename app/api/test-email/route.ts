// Test Email API Route
// Use this to test if emails are being sent correctly
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasPublicUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasPublicKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasSiteUrl = !!process.env.NEXT_PUBLIC_SITE_URL;

    // Try to create service client
    let serviceClientStatus = "Not tested";
    let emailTestStatus = "Not tested";
    let errorDetails = null;

    if (hasServiceKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );
        
        serviceClientStatus = "✅ Service client created";

        // Test sending password reset email to a test email
        const testEmail = 'test@example.com';
        const { error: emailError } = await supabaseAdmin.auth.resetPasswordForEmail(testEmail, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
        });

        if (emailError) {
          emailTestStatus = `❌ Email test failed: ${emailError.message}`;
          errorDetails = emailError;
        } else {
          emailTestStatus = `✅ Email function called (check Supabase logs)`;
        }

      } catch (error: any) {
        serviceClientStatus = `❌ Error: ${error.message}`;
        errorDetails = error;
      }
    }

    return NextResponse.json({
      status: "Email Configuration Test",
      environment: {
        NEXT_PUBLIC_SUPABASE_URL: hasPublicUrl ? "✅ Set" : "❌ Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: hasPublicKey ? "✅ Set" : "❌ Missing",
        SUPABASE_SERVICE_ROLE_KEY: hasServiceKey ? "✅ Set" : "❌ Missing",
        NEXT_PUBLIC_SITE_URL: hasSiteUrl ? `✅ ${process.env.NEXT_PUBLIC_SITE_URL}` : "❌ Missing (will use localhost)",
      },
      tests: {
        serviceClient: serviceClientStatus,
        emailTest: emailTestStatus,
      },
      errorDetails: errorDetails,
      instructions: {
        step1: "Go to Supabase Dashboard > Settings > API",
        step2: "Copy 'service_role' secret key (NOT anon key)",
        step3: "Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key",
        step4: "Restart your dev server",
        step5: "Check Supabase Dashboard > Authentication > Logs to see email attempts",
        step6: "For local testing, go to Supabase Dashboard > Project Settings > Auth > SMTP Settings",
        step7: "Supabase provides inbucket for local testing by default",
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}


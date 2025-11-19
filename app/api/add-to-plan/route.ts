// API Route: Add Event to Plan
// HR admins can add events to their plans
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: 'Event ID gereklidir' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }

    // Get HR profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'hr_admin') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      );
    }

    // Check if already in plan
    const { data: existingPlan, error: checkError } = await supabase
      .from('event_plans')
      .select('id, status')
      .eq('company_id', profile.company_id)
      .eq('event_id', event_id)
      .in('status', ['draft', 'quote_requested', 'approved'])
      .maybeSingle();

    console.log('[Add to Plan] Check existing:', { 
      company_id: profile.company_id, 
      event_id, 
      existingPlan, 
      checkError 
    });

    if (existingPlan) {
      console.log('[Add to Plan] Already exists:', existingPlan);
      return NextResponse.json(
        { error: 'Bu etkinlik zaten planlarınızda' },
        { status: 409 }
      );
    }

    // Add to plan
    const { error: insertError, data: planData } = await supabase
      .from('event_plans')
      .insert({
        company_id: profile.company_id,
        event_id: event_id,
        hr_id: user.id,
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Add to Plan Error]:', insertError);
      return NextResponse.json(
        { error: 'Plana eklenirken hata oluştu' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Etkinlik planlarınıza eklendi',
      plan: planData,
    });

  } catch (error: any) {
    console.error('[Add to Plan API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Sunucu hatası' },
      { status: 500 }
    );
  }
}


// API Route: Request Event Registration
// Allows employees to request participation in wellbeing events
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("[Request Event] Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body (support both JSON and formData)
    let eventId: string;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      eventId = body.event_id;
    } else {
      const formData = await request.formData();
      eventId = formData.get("event_id") as string;
    }

    if (!eventId) {
      console.error("[Request Event] Missing event ID");
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if already requested (don't fail if error, just check data)
    const { data: existingRequest, error: checkError } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .maybeSingle();

    if (checkError) {
      console.error("[WellScore] Check error (continuing):", checkError);
    }

    if (existingRequest) {
      console.log("[Request Event] Already requested");
      return NextResponse.json(
        { error: "Bu etkinlik zaten talep edilmiş" },
        { status: 409 }
      );
    }

    // Get user's profile to check company_id
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    console.log("[Request Event] User ID:", user.id);
    console.log("[Request Event] Event ID:", eventId);
    console.log("[Request Event] User Company ID:", userProfile?.company_id);

    // Try direct insert first (RLS is disabled in dev)
    const { error: directError, data: insertData } = await supabase
      .from("event_registrations")
      .insert({
        user_id: user.id,
        event_id: eventId,
        status: "requested",
      })
      .select()
      .single();

    if (directError) {
      console.error("[Request Event] Direct insert failed:", directError.message, directError.details, directError.hint, directError.code);
      
      // Try RPC function as fallback
      const { error: rpcError } = await supabase.rpc('request_event_registration', {
        p_user_id: user.id,
        p_event_id: eventId
      });
      
      if (rpcError) {
        console.error("[Request Event] RPC also failed:", rpcError.message, rpcError.details);
        return NextResponse.json(
          { error: directError.message || "Etkinlik talebi oluşturulamadı" },
          { status: 500 }
        );
      }
    }
    
    console.log("[Request Event] Event request successful, data:", insertData);
    return NextResponse.json({
      success: true,
      message: "Etkinlik talebi başarıyla oluşturuldu",
      data: insertData,
    });
  } catch (error: any) {
    console.error("[Request Event] Exception:", error);
    return NextResponse.json(
      { error: error.message || "Beklenmeyen bir hata oluştu" },
      { status: 500 }
    );
  }
}


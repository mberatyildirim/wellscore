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
      console.error("[WellScore] Auth error:", authError);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Parse form data
    const formData = await request.formData();
    const eventId = formData.get("event_id") as string;

    if (!eventId) {
      console.error("[WellScore] Missing event ID");
      return NextResponse.redirect(new URL("/employee/events?error=missing_event", request.url));
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
      console.log("[WellScore] Already requested, redirecting");
      return NextResponse.redirect(new URL("/employee/events?info=already_requested", request.url));
    }

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
      console.error("[WellScore] Direct insert failed:", directError.message, directError.details, directError.hint);
      
      // Try RPC function as fallback
      const { error: rpcError } = await supabase.rpc('request_event_registration', {
        p_user_id: user.id,
        p_event_id: eventId
      });
      
      if (rpcError) {
        console.error("[WellScore] RPC also failed:", rpcError.message, rpcError.details);
        return NextResponse.redirect(new URL(`/employee/events?error=failed&msg=${encodeURIComponent(directError.message)}`, request.url));
      }
    }
    
    console.log("[WellScore] Event request successful, data:", insertData);
    // Redirect back to events page with success
    return NextResponse.redirect(new URL("/employee/events?success=true", request.url));
  } catch (error) {
    console.error("[WellScore] Event request exception:", error);
    return NextResponse.redirect(new URL("/employee/events?error=exception", request.url));
  }
}


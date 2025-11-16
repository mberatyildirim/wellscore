import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { companyId } = await req.json();

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update all pending requests to meeting_requested
    const { error } = await supabase
      .from("service_requests")
      .update({ meeting_requested: true })
      .eq("company_id", companyId)
      .eq("status", "pending");

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: "Toplantı talebi gönderildi" 
    });
  } catch (error) {
    console.error("Error requesting meeting:", error);
    return NextResponse.json(
      { error: "Failed to request meeting" },
      { status: 500 }
    );
  }
}

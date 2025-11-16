import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { serviceId, companyId, userId } = await req.json();

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already in cart
    const { data: existing } = await supabase
      .from("service_requests")
      .select("id")
      .eq("company_id", companyId)
      .eq("service_id", serviceId)
      .eq("status", "pending")
      .single();

    if (existing) {
      return NextResponse.json({ message: "Already in cart" }, { status: 200 });
    }

    // Add to cart
    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        company_id: companyId,
        service_id: serviceId,
        requested_by: userId,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

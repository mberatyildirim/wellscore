import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateHRActions } from "@/lib/ai/generate-recommendations";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is HR admin (query profiles table)
    const { data: userData } = await supabase
      .from("profiles")
      .select("role, company_id")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "hr_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const companyId = userData.company_id;

    // Get employee count (from profiles table)
    const { count: employeeCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("company_id", companyId);

    // Get all survey responses for the company
    const { data: responses } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("company_id", companyId);

    const responseIds = responses?.map((r) => r.id) || [];

    // Get all answers (note: column name is answer_value, not score)
    const { data: answers } = await supabase
      .from("survey_answers")
      .select(`
        answer_value,
        survey_questions (
          dimension_id,
          wellbeing_dimensions (
            id,
            name,
            name_tr
          )
        )
      `)
      .in("response_id", responseIds);

    // Calculate dimension averages
    const dimensionScores: Record<string, any> = {};
    
    // Process answers to calculate dimension averages
    // Use answer_value (the actual DB column name)
    answers?.forEach((answer: any) => {
      const dimension = answer.survey_questions?.wellbeing_dimensions;
      if (dimension) {
        if (!dimensionScores[dimension.id]) {
          dimensionScores[dimension.id] = {
            dimension_id: dimension.id,
            dimension_name: dimension.name,
            dimension_name_tr: dimension.name_tr,
            scores: [],
          };
        }
        dimensionScores[dimension.id].scores.push(answer.answer_value);
      }
    });

    const dimensionAverages = Object.values(dimensionScores).map((d: any) => ({
      dimension_id: d.dimension_id,
      dimension_name: d.dimension_name,
      dimension_name_tr: d.dimension_name_tr,
      average_score: d.scores.reduce((a: number, b: number) => a + b, 0) / d.scores.length,
    }));

    const actions = await generateHRActions(
      companyId,
      dimensionAverages,
      employeeCount || 0
    );

    return NextResponse.json({ success: true, actions });
  } catch (error) {
    console.error("Error generating HR actions:", error);
    return NextResponse.json(
      { error: "Failed to generate actions" },
      { status: 500 }
    );
  }
}

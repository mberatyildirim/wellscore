import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmployeeRecommendations } from "@/lib/ai/generate-recommendations";

export async function POST(req: Request) {
  try {
    const { responseId } = await req.json();

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get survey response
    const { data: response } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("id", responseId)
      .eq("user_id", user.id)
      .single();

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    // Get answers
    const { data: answers } = await supabase
      .from("survey_answers")
      .select(`
        score,
        survey_questions (
          dimension_id,
          wellbeing_dimensions (
            id,
            name,
            name_tr
          )
        )
      `)
      .eq("response_id", responseId);

    // Calculate dimension scores
    const dimensionScores: Record<string, any> = {};
    
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
        dimensionScores[dimension.id].scores.push(answer.score);
      }
    });

    const dimensionAverages = Object.values(dimensionScores).map((d: any) => ({
      dimension_id: d.dimension_id,
      dimension_name: d.dimension_name,
      dimension_name_tr: d.dimension_name_tr,
      average_score: d.scores.reduce((a: number, b: number) => a + b, 0) / d.scores.length,
    }));

    const recommendations = await generateEmployeeRecommendations(
      user.id,
      responseId,
      dimensionAverages
    );

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

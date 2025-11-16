import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";

interface DimensionScore {
  dimension_id: string;
  dimension_name: string;
  dimension_name_tr: string;
  average_score: number;
}

export async function generateEmployeeRecommendations(
  userId: string,
  responseId: string,
  dimensionScores: DimensionScore[]
) {
  const supabase = await createClient();

  // Find areas needing improvement (score < 3.5)
  const improvementAreas = dimensionScores
    .filter((d) => d.average_score < 3.5)
    .sort((a, b) => a.average_score - b.average_score);

  // Find strengths (score >= 4.0)
  const strengths = dimensionScores.filter((d) => d.average_score >= 4.0);

  const overallScore =
    dimensionScores.reduce((sum, d) => sum + d.average_score, 0) /
    dimensionScores.length;

  const prompt = `Sen bir wellbeing uzmanısın. Aşağıdaki çalışan wellbeing değerlendirmesine göre kişiselleştirilmiş öneriler oluştur.

Genel WellScore: ${overallScore.toFixed(1)} / 5.0

Boyut Skorları:
${dimensionScores
  .map((d) => `- ${d.dimension_name_tr}: ${d.average_score.toFixed(1)} / 5.0`)
  .join("\n")}

${improvementAreas.length > 0 ? `İyileştirme Gereken Alanlar:
${improvementAreas.map((d) => `- ${d.dimension_name_tr}: ${d.average_score.toFixed(1)}`).join("\n")}` : ""}

${strengths.length > 0 ? `Güçlü Alanlar:
${strengths.map((d) => `- ${d.dimension_name_tr}: ${d.average_score.toFixed(1)}`).join("\n")}` : ""}

Lütfen aşağıdaki formatta öneriler oluştur:

KISA_VADELI:
- [Öneri 1]
- [Öneri 2]
- [Öneri 3]

ORTA_VADELI:
- [Öneri 1]
- [Öneri 2]
- [Öneri 3]

UZUN_VADELI:
- [Öneri 1]
- [Öneri 2]
- [Öneri 3]

Öneriler:
- Türkçe olmalı
- Somut ve uygulanabilir olmalı
- Düşük skorlu alanlara odaklanmalı
- Pozitif ve motive edici dilde yazılmalı
- Her biri 1-2 cümle olmalı`;

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt,
      maxOutputTokens: 1500,
      temperature: 0.7,
    });

    // Parse recommendations from text
    const recommendations = parseRecommendations(text);

    // Save to database
    const savedRecommendations = [];

    for (const rec of recommendations) {
      // Try to match recommendation to a dimension
      let matchedDimensionId = null;
      for (const dim of improvementAreas) {
        if (rec.text.toLowerCase().includes(dim.dimension_name_tr.toLowerCase())) {
          matchedDimensionId = dim.dimension_id;
          break;
        }
      }

      const { data } = await supabase
        .from("recommendations")
        .insert({
          user_id: userId,
          response_id: responseId,
          dimension_id: matchedDimensionId,
          timeframe: rec.timeframe,
          recommendation_text: rec.text,
        })
        .select()
        .single();

      if (data) savedRecommendations.push(data);
    }

    return savedRecommendations;
  } catch (error) {
    console.error("AI recommendation generation failed:", error);
    throw error;
  }
}

export async function generateHRActions(
  companyId: string,
  dimensionScores: DimensionScore[],
  employeeCount: number
) {
  const supabase = await createClient();

  // Find critical areas (score < 3.0)
  const criticalAreas = dimensionScores
    .filter((d) => d.average_score < 3.0)
    .sort((a, b) => a.average_score - b.average_score);

  // Find improvement areas (score 3.0-3.5)
  const improvementAreas = dimensionScores.filter(
    (d) => d.average_score >= 3.0 && d.average_score < 3.5
  );

  const overallScore =
    dimensionScores.reduce((sum, d) => sum + d.average_score, 0) /
    dimensionScores.length;

  const prompt = `Sen bir kurumsal wellbeing danışmanısın. Aşağıdaki şirket wellbeing verilerine göre İK için aksiyon planları oluştur.

Şirket Büyüklüğü: ${employeeCount} çalışan
Genel WellScore: ${overallScore.toFixed(1)} / 5.0

Boyut Skorları:
${dimensionScores
  .map((d) => `- ${d.dimension_name_tr}: ${d.average_score.toFixed(1)} / 5.0`)
  .join("\n")}

${criticalAreas.length > 0 ? `Kritik Alanlar (Acil Aksiyon):
${criticalAreas.map((d) => `- ${d.dimension_name_tr}: ${d.average_score.toFixed(1)}`).join("\n")}` : ""}

${improvementAreas.length > 0 ? `İyileştirme Alanları:
${improvementAreas.map((d) => `- ${d.dimension_name_tr}: ${d.average_score.toFixed(1)}`).join("\n")}` : ""}

Her kritik veya iyileştirme alanı için şu formatta aksiyon planları oluştur:

[Boyut Adı] - [Bütçe Seviyesi: DÜŞÜK/ORTA/YÜKSEK]
Başlık: [Kısa başlık]
Açıklama: [Detaylı aksiyon planı - 2-3 cümle]
Hedef Çalışan: [Kaç çalışana hitap ettiği - sayı]

Aksiyon Planları:`;

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt,
      maxOutputTokens: 2000,
      temperature: 0.7,
    });

    // Parse actions from text
    const actions = parseHRActions(text, dimensionScores);

    // Save to database
    const savedActions = [];
    const { data: { user } } = await supabase.auth.getUser();

    for (const action of actions) {
      const { data } = await supabase
        .from("hr_actions")
        .insert({
          company_id: companyId,
          dimension_id: action.dimension_id,
          title: action.title,
          description: action.description,
          budget_level: action.budget_level,
          target_employee_count: action.target_employee_count,
          status: "planned",
          created_by: user?.id,
        })
        .select()
        .single();

      if (data) savedActions.push(data);
    }

    return savedActions;
  } catch (error) {
    console.error("AI HR action generation failed:", error);
    throw error;
  }
}

function parseRecommendations(text: string) {
  const recommendations: Array<{
    timeframe: "short_term" | "medium_term" | "long_term";
    text: string;
  }> = [];

  const sections = {
    short_term: /KISA_VADELI:?\s*([\s\S]*?)(?=ORTA_VADELI:|UZUN_VADELI:|$)/i,
    medium_term: /ORTA_VADELI:?\s*([\s\S]*?)(?=UZUN_VADELI:|$)/i,
    long_term: /UZUN_VADELI:?\s*([\s\S]*?)$/i,
  };

  for (const [timeframe, regex] of Object.entries(sections)) {
    const match = text.match(regex);
    if (match && match[1]) {
      const items = match[1]
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.replace(/^-\s*/, "").trim())
        .filter((line) => line.length > 0);

      items.forEach((item) => {
        recommendations.push({
          timeframe: timeframe as any,
          text: item,
        });
      });
    }
  }

  return recommendations;
}

function parseHRActions(text: string, dimensionScores: DimensionScore[]) {
  const actions: Array<{
    dimension_id: string | null;
    title: string;
    description: string;
    budget_level: "low" | "medium" | "high";
    target_employee_count: number;
  }> = [];

  // Split by dimension mentions
  const lines = text.split("\n").filter((l) => l.trim());

  let currentAction: any = null;

  for (const line of lines) {
    // Check for dimension and budget level
    const dimensionMatch = line.match(/\[(.*?)\]\s*-\s*\[Bütçe.*?:\s*(DÜŞÜK|ORTA|YÜKSEK)\]/i);
    if (dimensionMatch) {
      if (currentAction && currentAction.title) {
        actions.push(currentAction);
      }
      
      const dimensionName = dimensionMatch[1].trim();
      const budgetLevel = dimensionMatch[2].trim();
      
      const matchedDim = dimensionScores.find((d) =>
        d.dimension_name_tr.toLowerCase().includes(dimensionName.toLowerCase())
      );

      currentAction = {
        dimension_id: matchedDim?.dimension_id || null,
        budget_level: budgetLevel === "DÜŞÜK" ? "low" : budgetLevel === "ORTA" ? "medium" : "high",
        title: "",
        description: "",
        target_employee_count: 0,
      };
    }

    if (currentAction) {
      if (line.startsWith("Başlık:")) {
        currentAction.title = line.replace("Başlık:", "").trim();
      } else if (line.startsWith("Açıklama:")) {
        currentAction.description = line.replace("Açıklama:", "").trim();
      } else if (line.startsWith("Hedef Çalışan:")) {
        const countMatch = line.match(/\d+/);
        if (countMatch) {
          currentAction.target_employee_count = parseInt(countMatch[0]);
        }
      }
    }
  }

  if (currentAction && currentAction.title) {
    actions.push(currentAction);
  }

  return actions;
}

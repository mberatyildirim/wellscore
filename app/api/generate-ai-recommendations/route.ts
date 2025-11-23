// API Route: Generate AI Recommendations for Employee
// Called after survey completion to generate personalized event recommendations and wellbeing tips
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { responseId } = await req.json();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get survey response
    const { data: response, error: responseError } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("id", responseId)
      .eq("user_id", user.id)
      .single();

    if (responseError || !response) {
      return NextResponse.json(
        { error: "Survey response not found" },
        { status: 404 }
      );
    }

    // Get dimension scores
    const { data: dimensionScores } = await supabase
      .from("dimension_scores")
      .select(`
        score,
        wellbeing_dimensions (
          id,
          name_tr,
          description
        )
      `)
      .eq("response_id", responseId);

    // Get all available events
    const { data: allEvents } = await supabase
      .from("events")
      .select(`
        id,
        title,
        description,
        event_type,
        location,
        wellbeing_dimensions (
          id,
          name_tr
        )
      `)
      .order("created_at", { ascending: false });

    // Prepare dimension scores summary
    const dimensionSummary = dimensionScores?.map((ds: any) => ({
      dimension: ds.wellbeing_dimensions?.name_tr,
      score: ds.score,
      description: ds.wellbeing_dimensions?.description,
    })) || [];

    // Identify improvement areas (scores < 3.5)
    const improvementAreas = dimensionSummary
      .filter((d: any) => d.score < 3.5)
      .map((d: any) => d.dimension);

    // Prepare events list for AI with numbered format
    const eventsList = allEvents?.map((event: any, index: number) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.event_type,
      location: event.location,
      dimension: event.wellbeing_dimensions?.name_tr || "Genel",
    })) || [];

    console.log("📋 [AI API] Total events to send:", eventsList.length);
    console.log("📋 [AI API] Events list:", JSON.stringify(eventsList.slice(0, 5), null, 2), "... (showing first 5)");

    // Create AI prompt in Turkish with better event formatting
    const prompt = `Sen bir wellbeing (iyi oluş) uzmanısın. Bir çalışanın WellScore anket sonuçlarını analiz edip kişiselleştirilmiş öneriler sunacaksın.

KULLANICI BİLGİLERİ:
- Genel WellScore: ${response.overall_score}/5.0
- Boyut Skorları:
${dimensionSummary.map((d: any) => `  • ${d.dimension}: ${d.score}/5.0`).join("\n")}

${improvementAreas.length > 0 ? `\nİYİLEŞTİRME GEREKTİREN ALANLAR:\n${improvementAreas.map((a: string) => `  • ${a}`).join("\n")}` : ""}

MEVCUT ETKİNLİKLER (TOPLAM ${eventsList.length} ETKİNLİK):
${eventsList.map((e: any, index: number) => `${index + 1}. [ID: ${e.id}] ${e.title}
   - Boyut: ${e.dimension}
   - Tip: ${e.type}
   - Konum: ${e.location || "Belirtilmemiş"}
   - Açıklama: ${e.description || "Açıklama yok"}`).join("\n\n")}

ÖNEMLİ: Yukarıdaki etkinlik listesinden, kullanıcının düşük skorlu alanlarına ve genel wellbeing durumuna göre EN UYGUN 5-8 ETKİNLİĞİ SEÇMELİSİN. Her etkinlik için event_id'yi TAM OLARAK yukarıdaki listeden kopyala.

GÖREVİN:
1. YUKARIDAKİ ETKİNLİK LİSTESİNDEN, kullanıcının düşük skorlu alanlarına ve genel wellbeing durumuna göre EN UYGUN 5-8 ETKİNLİĞİ SEÇ. Her etkinlik için event_id'yi TAM OLARAK yukarıdaki listeden kopyala (örnek: "event_id": "550e8400-e29b-41d4-a716-446655440000").
2. Her seçtiğin etkinlik için 2-3 cümlelik Türkçe bir gerekçe yaz (neden bu etkinlik öneriliyor).
3. Genel wellbeing önerileri ver (her boyut için 2-3 kısa, uygulanabilir öneri).

ÇIKTI FORMATI (JSON):
{
  "recommended_events": [
    {
      "event_id": "etkinlik-id",
      "reason": "Bu etkinlik neden öneriliyor (2-3 cümle, Türkçe)"
    }
  ],
  "wellbeing_tips": {
    "Fiziksel Sağlık": ["Öneri 1", "Öneri 2"],
    "Zihinsel/Duygusal Sağlık": ["Öneri 1", "Öneri 2"],
    "Sosyal Sağlık": ["Öneri 1", "Öneri 2"],
    "Mesleki Sağlık": ["Öneri 1", "Öneri 2"],
    "Entelektüel Sağlık": ["Öneri 1", "Öneri 2"],
    "Çevresel Sağlık": ["Öneri 1", "Öneri 2"],
    "Finansal Sağlık": ["Öneri 1", "Öneri 2"],
    "Ruhsal/Manevi Sağlık": ["Öneri 1", "Öneri 2"]
  }
}

SADECE JSON DÖNDÜR, BAŞKA BİR ŞEY YAZMA.`;

    // Call OpenAI API
    console.log("🤖 [AI API] Calling OpenAI API...");
    console.log("🤖 [AI API] Prompt length:", prompt.length);
    console.log("🤖 [AI API] Events in prompt:", eventsList.length);
    console.log("🤖 [AI API] First 3 events in prompt:", eventsList.slice(0, 3).map((e: any) => `${e.title} (ID: ${e.id})`));
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen bir wellbeing uzmanısın. Türkçe yanıt ver ve sadece JSON formatında çıktı üret.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    console.log("🤖 [AI API] OpenAI Response received");
    console.log("🤖 [AI API] Usage:", completion.usage);

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      console.error("❌ [AI API] No AI response content");
      throw new Error("AI yanıtı alınamadı");
    }

    console.log("🤖 [AI API] Raw AI Response:", aiResponse);
    console.log("🤖 [AI API] Response length:", aiResponse.length);

    // Parse AI response
    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
      console.log("✅ [AI API] Parsed recommendations:", JSON.stringify(recommendations, null, 2));
    } catch (parseError) {
      console.error("❌ [AI API] Parse error:", parseError);
      console.error("❌ [AI API] Raw response that failed to parse:", aiResponse);
      throw new Error("AI yanıtı parse edilemedi");
    }

    // Validate event IDs exist
    const validEventIds = new Set(allEvents?.map((e: any) => e.id) || []);
    console.log("🔍 [AI API] Valid event IDs count:", validEventIds.size);
    console.log("🔍 [AI API] Recommended events from AI:", recommendations.recommended_events?.length || 0);
    
    const validatedEvents = recommendations.recommended_events?.filter(
      (rec: any) => validEventIds.has(rec.event_id)
    ) || [];

    console.log("✅ [AI API] Validated events count:", validatedEvents.length);

    // Prepare final recommendations object
    const finalRecommendations = {
      wellbeing_tips: recommendations.wellbeing_tips || {},
      recommended_events: validatedEvents,
      generated_at: new Date().toISOString(),
      survey_response_id: responseId,
      overall_score: response.overall_score,
    };

    console.log("💾 [AI API] Final recommendations:", JSON.stringify(finalRecommendations, null, 2));

    // Save to profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        ai_recommendations: finalRecommendations,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      throw new Error("Öneriler kaydedilemedi");
    }

    return NextResponse.json({
      success: true,
      recommendations: finalRecommendations,
    });
  } catch (error: any) {
    console.error("[AI Recommendations Error]:", error);
    return NextResponse.json(
      {
        error: error.message || "AI önerileri oluşturulamadı",
      },
      { status: 500 }
    );
  }
}


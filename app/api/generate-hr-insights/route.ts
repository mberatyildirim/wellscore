// API Route: Generate HR Insights
// Called by HR admin to get organizational wellbeing insights based on company-wide survey data
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    // Check for API key (lazy initialization to avoid build errors)
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Initialize OpenAI client (only when needed, not at module level)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get HR profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "hr_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all survey responses for this company
    const { data: companyResponses } = await supabase
      .from("survey_responses")
      .select("id, overall_score, completed_at")
      .eq("company_id", profile.company_id)
      .order("completed_at", { ascending: false });

    if (!companyResponses || companyResponses.length === 0) {
      return NextResponse.json(
        { error: "No survey responses found for this company" },
        { status: 404 }
      );
    }

    // Get dimension scores for all responses
    const { data: allDimensionScores } = await supabase
      .from("dimension_scores")
      .select(`
        dimension_id,
        score,
        wellbeing_dimensions (
          id,
          name_tr
        ),
        survey_responses!inner(
          company_id
        )
      `)
      .eq("survey_responses.company_id", profile.company_id);

    // Get all survey answers for distribution analysis
    const { data: allAnswers } = await supabase
      .from("survey_answers")
      .select(`
        answer_value,
        dimension_id,
        wellbeing_dimensions (
          name_tr
        ),
        survey_responses!inner(
          company_id
        )
      `)
      .eq("survey_responses.company_id", profile.company_id);

    // Get all available events (for referencing)
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

    // Calculate dimension averages (0-100 scale)
    const dimensionAverages: Record<string, { name: string; avgScore: number; count: number }> = {};
    allDimensionScores?.forEach((ds: any) => {
      const dimId = ds.dimension_id;
      const dimName = ds.wellbeing_dimensions?.name_tr || "Genel";
      if (!dimensionAverages[dimId]) {
        dimensionAverages[dimId] = { name: dimName, avgScore: 0, count: 0 };
      }
      dimensionAverages[dimId].avgScore += ds.score;
      dimensionAverages[dimId].count += 1;
    });

    // Convert to 0-100 scale and calculate averages
    const dimensionSummary = Object.entries(dimensionAverages).map(([dimId, data]) => ({
      dimension_id: dimId,
      dimension: data.name,
      avg_score_0_5: (data.avgScore / data.count),
      avg_score_0_100: ((data.avgScore / data.count) / 5) * 100,
      response_count: data.count,
    }));

    // Calculate answer distributions by dimension
    const answerDistributions: Record<string, Record<number, number>> = {};
    allAnswers?.forEach((answer: any) => {
      const dimId = answer.dimension_id;
      const value = answer.answer_value;
      if (!answerDistributions[dimId]) {
        answerDistributions[dimId] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      answerDistributions[dimId][value] = (answerDistributions[dimId][value] || 0) + 1;
    });

    // Prepare events list for referencing
    const eventsList = allEvents?.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.event_type,
      location: event.location,
      dimension: event.wellbeing_dimensions?.name_tr || "Genel",
    })) || [];

    // Create HR-specific prompt
    const prompt = `Sen Wellscore HR Insights Engine'sin.

Görevin, yalnızca toplu anket verilerine dayanarak, İK için nötr, uygulanabilir ve tanı içermeyen well-being içgörüleri üretmektir.

✅ KURALLAR & SINIRLAR

Bireylerle ilgili hiçbir çıkarım yapma.
– Sadece ekip / mağaza / departman düzeyinde konuş
– "Bazı kişiler, çalışanlardan biri, bireysel…" gibi ifadeler yok

Sadece sağlanan veriyi kullan:
– boyut ortalamaları (0–100)
– yanıt dağılımları (1–5)
– varsa dönemsel değişim (trend)

Ton:
– Nötr, profesyonel, destekleyici
– Alarm veren, kriz dili kullanma

Tıbbi veya psikolojik yorum yapma.
– "Tükenmişlik, depresyon, riskli, sorunlu" gibi ifadeler yok

Öneriler kişisel alışkanlıklara değil, organizasyonel koşullara yönelik olmalı.
– iletişim, programlama, ortam, erişim, katılım

En fazla 3 içgörü + en fazla 3 öneri üret.
– basit, uygulanabilir, düşük eforlu

Skor formüllerinden veya iç mantıktan bahsetme.
– dışarıya sadece sonuç verir

ŞİRKET VERİLERİ:
- Toplam Anket Sayısı: ${companyResponses.length}
- Genel Ortalama WellScore: ${(companyResponses.reduce((sum, r) => sum + (r.overall_score || 0), 0) / companyResponses.length).toFixed(1)}/5.0

- Boyut Ortalamaları (0-100):
${dimensionSummary.map((d: any) => `  • ${d.dimension}: ${d.avg_score_0_100.toFixed(0)}/100 (${d.avg_score_0_5.toFixed(1)}/5.0) - ${d.response_count} yanıt`).join("\n")}

- Yanıt Dağılımları (1-5 Likert):
${Object.entries(answerDistributions).map(([dimId, dist]) => {
  const dimName = dimensionSummary.find((d: any) => d.dimension_id === dimId)?.dimension || "Genel";
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  return `${dimName}:\n${Object.entries(dist).map(([value, count]) => `  • ${value}/5: ${count} yanıt (${((count / total) * 100).toFixed(1)}%)`).join("\n")}`;
}).join("\n\n")}

MEVCUT ETKİNLİKLER (TOPLAM ${eventsList.length} ETKİNLİK - ÖNERİLERDE MUTLAKA REFERANS VER):
${eventsList.map((e: any, index: number) => `${index + 1}. [ID: ${e.id}] ${e.title}
   - Boyut: ${e.dimension}
   - Tip: ${e.type}
   - Konum: ${e.location || "Belirtilmemiş"}
   - Açıklama: ${e.description || "Açıklama yok"}`).join("\n\n")}

ÖNEMLİ: Önerilerinde MUTLAKA yukarıdaki etkinliklerden bahset ve referans ver. Her boyut için uygun etkinlikleri öner.

GÖREVİN:
Her boyut için aşağıdaki formatta içgörü ve öneriler üret. Önerilerinde MUTLAKA mevcut etkinliklerden bahset.

ÇIKTI FORMATI (JSON):
{
  "insights": {
    "Fiziksel Sağlık": {
      "score_level": "85-100 | 70-84 | 50-69 | 0-49",
      "core_insight": "Toplu veriye dayalı kısa bir gözlem (nötr)",
      "strength_area": "Korunması gereken olumlu bir organizasyonel örüntü",
      "development_area": "İyileştirme fırsatı içeren genel bir tema (neden belirtmeden)",
      "recommended_actions": [
        "1 düşük eforlu aksiyon (etkinlik referansı ile)",
        "1 iletişim / katılım önerisi (etkinlik referansı ile)",
        "1 isteğe bağlı tekrar ölçüm / takip"
      ],
      "referenced_events": ["event_id_1", "event_id_2"]
    },
    "Zihinsel/Duygusal Sağlık": { ... },
    "Sosyal Sağlık": { ... },
    "Mesleki Sağlık": { ... },
    "Entelektüel Sağlık": { ... },
    "Çevresel Sağlık": { ... },
    "Finansal Sağlık": { ... },
    "Ruhsal/Manevi Sağlık": { ... }
  },
  "closing_statement": "Bu öneriler çalışan davranışlarını değil, organizasyonel koşulları desteklemek içindir."
}

ÖNEMLİ: 
- Her boyut için skor seviyesine göre ton kullan (85-100: koru, 70-84: stabil, 50-69: destekleyici, 0-49: nazik).
- Önerilerinde MUTLAKA mevcut etkinliklerden bahset ve event_id'leri referenced_events array'ine ekle.
- Sadece organizasyonel koşullara odaklan, bireysel çıkarım yapma.
- Tıbbi tavsiye, tanı veya uyarı dili kullanma.

SADECE JSON DÖNDÜR, BAŞKA BİR ŞEY YAZMA.`;

    // Call OpenAI API
    console.log("🤖 [HR Insights] Calling OpenAI API...");
    console.log("🤖 [HR Insights] Company ID:", profile.company_id);
    console.log("🤖 [HR Insights] Total responses:", companyResponses.length);
    console.log("🤖 [HR Insights] Total events:", eventsList.length);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sen Wellscore HR Insights Engine'sin. Türkçe yanıt ver ve sadece JSON formatında çıktı üret. Önerilerinde MUTLAKA mevcut etkinliklerden bahset.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    console.log("🤖 [HR Insights] OpenAI Response received");

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      console.error("❌ [HR Insights] No AI response content");
      throw new Error("AI yanıtı alınamadı");
    }

    console.log("🤖 [HR Insights] Raw AI Response length:", aiResponse.length);

    // Parse AI response
    let insights;
    try {
      insights = JSON.parse(aiResponse);
      console.log("✅ [HR Insights] Parsed insights");
    } catch (parseError) {
      console.error("❌ [HR Insights] Parse error:", parseError);
      throw new Error("AI yanıtı parse edilemedi");
    }

    // Prepare final insights object
    const finalInsights = {
      insights: insights.insights || {},
      closing_statement: insights.closing_statement || "Bu öneriler çalışan davranışlarını değil, organizasyonel koşulları desteklemek içindir.",
      generated_at: new Date().toISOString(),
      company_id: profile.company_id,
      total_responses: companyResponses.length,
    };

    console.log("💾 [HR Insights] Final insights prepared");

    // Save to profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        hr_insights: finalInsights,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      // Don't fail the request, just log the error
      console.warn("⚠️ [HR Insights] Could not save to database, but insights were generated");
    } else {
      console.log("✅ [HR Insights] Saved to profiles table");
    }

    return NextResponse.json({
      success: true,
      insights: finalInsights,
    });
  } catch (error: any) {
    console.error("[HR Insights Error]:", error);
    return NextResponse.json(
      {
        error: error.message || "HR içgörüleri oluşturulamadı",
      },
      { status: 500 }
    );
  }
}


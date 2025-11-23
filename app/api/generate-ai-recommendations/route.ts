// API Route: Generate AI Recommendations for Employee
// Called after survey completion to generate personalized event recommendations and wellbeing tips
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

    // Get survey answers (per-question Likert answers 1-5)
    const { data: surveyAnswers } = await supabase
      .from("survey_answers")
      .select(`
        answer_value,
        survey_questions (
          id,
          question_text_tr,
          dimension_id
        ),
        wellbeing_dimensions (
          id,
          name_tr
        )
      `)
      .eq("response_id", responseId)
      .order("survey_questions(order_index)", { ascending: true });

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

    // Prepare dimension scores summary (convert 0-5 to 0-100 for prompt)
    const dimensionSummary = dimensionScores?.map((ds: any) => ({
      dimension: ds.wellbeing_dimensions?.name_tr,
      score: ds.score,
      score_0_100: (ds.score / 5) * 100, // Convert to 0-100 scale
      description: ds.wellbeing_dimensions?.description,
    })) || [];

    // Prepare survey answers grouped by dimension
    const answersByDimension: Record<string, Array<{ question: string; answer: number }>> = {};
    surveyAnswers?.forEach((answer: any) => {
      const dimensionName = answer.wellbeing_dimensions?.name_tr || "Genel";
      if (!answersByDimension[dimensionName]) {
        answersByDimension[dimensionName] = [];
      }
      answersByDimension[dimensionName].push({
        question: answer.survey_questions?.question_text_tr || "",
        answer: answer.answer_value,
      });
    });

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

    // Create AI prompt in Turkish with new wellbeing tips format
    const prompt = `Sen Wellscore Recommendation Engine'sin.

Görevin, kullanıcının anket cevaplarına ve boyut skorlarına dayanarak destekleyici, gerçekçi ve tanı koymayan wellbeing önerileri üretmek.

✅ KURALLAR & KISITLAR

Tahmin etme, çıkarım yapma veya bilgi uydurma.
– Kullanıcı açıkça belirtmedikçe semptom, ağrı, tükenmişlik, kaygı, yaralanma vb. asla bahsetme.

Sadece sağlanan bilgileri kullan:
– Boyut skorları (0–100)
– Soru bazlı Likert cevapları (1–5)

Ton, skor seviyesine uymalı:
– 85–100: kutla + koru (iyileştirme baskısı yok)
– 70–84: stabil + küçük opsiyonel iyileştirmeler
– 50–69: destekleyici + 1 öncelikli öneri
– 0–49: nazik + tek ulaşılabilir adım (alarm veren dil yok)

Tıbbi, terapötik veya tanı koyucu dilden kaçın.
– Tedavi yok, klinik iddia yok, varsayım yok.

Önerileri küçük, uygulanabilir ve opsiyonel tut.
– maksimum 1–2 mikro-aksiyon
– seçenek sun, zorunluluk değil

Olumsuz çerçeveleme yok.
– güçlü yönlere, ilerlemeye, sürdürülebilirliğe odaklan

Skorlama formülü veya iç mantığa asla referans verme.

✅ ÖNERİ ÜRETME YÖNTEMİ

Kullanıcının katıldığı ifadeleri (4–5) belirle → güçlendir ve koru.
Nötr ifadeleri (3) belirle → nazik iyileştirme seçenekleri sun.
Düşük skorları görmezden gel, boyut genelinde tutarlı değilse.
Büyük müdahaleler yerine günlük/haftalık alışkanlıkları önceliklendir.

KULLANICI BİLGİLERİ:
- Genel WellScore: ${response.overall_score}/5.0
- Boyut Skorları (0-100):
${dimensionSummary.map((d: any) => `  • ${d.dimension}: ${d.score_0_100.toFixed(0)}/100 (${d.score}/5.0)`).join("\n")}

- Soru Bazlı Cevaplar (1-5 Likert):
${Object.entries(answersByDimension).map(([dimension, answers]) => `
${dimension}:
${answers.map((a: any) => `  • "${a.question}": ${a.answer}/5`).join("\n")}`).join("\n")}

MEVCUT ETKİNLİKLER (TOPLAM ${eventsList.length} ETKİNLİK):
${eventsList.map((e: any, index: number) => `${index + 1}. [ID: ${e.id}] ${e.title}
   - Boyut: ${e.dimension}
   - Tip: ${e.type}
   - Konum: ${e.location || "Belirtilmemiş"}
   - Açıklama: ${e.description || "Açıklama yok"}`).join("\n\n")}

ÖNEMLİ: SADECE YUKARIDAKİ ETKİNLİK LİSTESİNDEKİ ETKİNLİKLERİ ÖNEREBİLİRSİN. LİSTEDE OLMAYAN HİÇBİR ETKİNLİK ÖNERME. EĞER UYGUN ETKİNLİK YOKSA, O BOYUT İÇİN ETKİNLİK ÖNERME.

GÖREVİN:
1. YUKARIDAKİ ETKİNLİK LİSTESİNDEN, kullanıcının düşük skorlu alanlarına ve genel wellbeing durumuna göre EN UYGUN 5-8 ETKİNLİĞİ SEÇ. SADECE LİSTEDE OLAN ETKİNLİKLERİ ÖNER. Her etkinlik için event_id'yi TAM OLARAK yukarıdaki listeden kopyala (örnek: "event_id": "550e8400-e29b-41d4-a716-446655440000").
2. Her seçtiğin etkinlik için 2-3 cümlelik Türkçe bir gerekçe yaz (neden bu etkinlik öneriliyor).
3. Her boyut için wellbeing önerileri ver (aşağıdaki formata göre).

ÇIKTI FORMATI (JSON):
{
  "recommended_events": [
    {
      "event_id": "etkinlik-id",
      "reason": "Bu etkinlik neden öneriliyor (2-3 cümle, Türkçe)"
    }
  ],
  "wellbeing_tips": {
    "Fiziksel Sağlık": {
      "strength_insight": "Kısa bir onaylama - kullanıcının zaten iyi yaptığı şeylere dayanarak",
      "optional_suggestion": "1 gerçekçi, opsiyonel mikro-aksiyon (varsayım yok)"
    },
    "Zihinsel/Duygusal Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    },
    "Sosyal Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    },
    "Mesleki Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    },
    "Entelektüel Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    },
    "Çevresel Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    },
    "Finansal Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    },
    "Ruhsal/Manevi Sağlık": {
      "strength_insight": "...",
      "optional_suggestion": "..."
    }
  }
}

ÖNEMLİ: 
- Her boyut için skor seviyesine göre ton kullan (85-100: kutla, 70-84: stabil, 50-69: destekleyici, 0-49: nazik).
- Sadece kullanıcının açıkça belirttiği bilgileri kullan.
- Tıbbi tavsiye, tanı veya uyarı dili kullanma.
- Her öneriyi "İstersen bunu senin için hatırlatma olarak ekleyebilirim / seçenek sunabilirim." ile bitir.

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


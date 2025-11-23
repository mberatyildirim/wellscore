// AI Recommendations Page - Shows AI-generated event recommendations and wellbeing tips
'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sparkles, CheckCircle2, X, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Image from "next/image";

interface RecommendedEvent {
  event_id: string;
  reason: string;
}

interface WellbeingTips {
  [dimension: string]: string[];
}

interface AIRecommendations {
  wellbeing_tips: WellbeingTips;
  recommended_events: RecommendedEvent[];
  generated_at: string;
  survey_response_id: string;
  overall_score: number;
}

export default function AIRecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [requestingEvents, setRequestingEvents] = useState<Set<string>>(new Set());
  const [requestedEvents, setRequestedEvents] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Get user profile with AI recommendations
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("ai_recommendations")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("[Profile Error]:", profileError);
          setLoading(false);
          return;
        }

        if (!profile?.ai_recommendations) {
          // No recommendations yet - check if there's a recent survey response
          const { data: latestResponse } = await supabase
            .from("survey_responses")
            .select("id, completed_at")
            .eq("user_id", user.id)
            .order("completed_at", { ascending: false })
            .limit(1)
            .single();

          // If there's a recent response (within last 5 minutes), try to generate automatically
          if (latestResponse) {
            const responseTime = new Date(latestResponse.completed_at);
            const now = new Date();
            const minutesSinceResponse = (now.getTime() - responseTime.getTime()) / (1000 * 60);

            if (minutesSinceResponse < 5) {
              // Recent survey, try to generate automatically
              console.log("🔄 [AI Recommendations] Recent survey detected, generating automatically...");
              try {
                const generateResponse = await fetch("/api/generate-ai-recommendations", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ responseId: latestResponse.id }),
                });

                if (generateResponse.ok) {
                  const generateResult = await generateResponse.json();
                  console.log("✅ [AI Recommendations] Auto-generated successfully");
                  
                  // Reload profile to get new recommendations
                  const { data: updatedProfile } = await supabase
                    .from("profiles")
                    .select("ai_recommendations")
                    .eq("id", user.id)
                    .single();

                  if (updatedProfile?.ai_recommendations) {
                    setRecommendations(updatedProfile.ai_recommendations as AIRecommendations);
                    // Continue loading events (don't return, let it continue)
                  } else {
                    setLoading(false);
                    return;
                  }
                } else {
                  console.log("⚠️ [AI Recommendations] Auto-generation failed, showing button");
                  setLoading(false);
                  return;
                }
              } catch (error) {
                console.error("❌ [AI Recommendations] Auto-generation error:", error);
                setLoading(false);
                return;
              }
            } else {
              // Not recent, just show button
              setLoading(false);
              return;
            }
          } else {
            // No survey response, show button
            setLoading(false);
            return;
          }
        }

        // If we have recommendations (either from profile or auto-generated), load events
        if (!recommendations && profile?.ai_recommendations) {
          setRecommendations(profile.ai_recommendations as AIRecommendations);
        }

        // Get all events
        const { data: eventsData } = await supabase
          .from("events")
          .select(`
            *,
            wellbeing_dimensions(id, name_tr, color)
          `)
          .order("created_at", { ascending: false });

        setEvents(eventsData || []);

        // Get already requested events
        const { data: registrations } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", user.id)
          .eq("status", "requested");

        if (registrations) {
          setRequestedEvents(new Set(registrations.map((r: any) => r.event_id)));
        }
      } catch (error) {
        console.error("[Load Data Error]:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleRequestEvent = async (eventId: string) => {
    setRequestingEvents(prev => new Set([...prev, eventId]));

    try {
      console.log("📤 [Request Event] Sending request for event:", eventId);
      
      const response = await fetch("/api/request-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      console.log("📥 [Request Event] Response status:", response.status);
      console.log("📥 [Request Event] Response headers:", response.headers.get("content-type"));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("❌ [Request Event] Non-JSON response:", text.substring(0, 200));
        throw new Error("Sunucudan beklenmeyen yanıt alındı");
      }

      const result = await response.json();
      console.log("📥 [Request Event] Response data:", result);

      if (!response.ok) {
        throw new Error(result.error || "Etkinlik talebi oluşturulamadı");
      }

      toast.success("✅ Etkinlik talebiniz oluşturuldu!");
      setRequestedEvents(prev => new Set([...prev, eventId]));
    } catch (error: any) {
      console.error("❌ [Request Event] Error:", error);
      toast.error(error.message || "Etkinlik talebi oluşturulamadı");
    } finally {
      setRequestingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const handleDeclineEvent = (eventId: string) => {
    // Just remove from recommended list (client-side only)
    if (recommendations) {
      const updatedEvents = recommendations.recommended_events.filter(
        (e: RecommendedEvent) => e.event_id !== eventId
      );
      setRecommendations({
        ...recommendations,
        recommended_events: updatedEvents,
      });
    }
  };

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Giriş yapmanız gerekiyor");
        return;
      }

      // Get latest survey response
      const { data: latestResponse, error: responseError } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      if (responseError || !latestResponse) {
        toast.error("Önce bir anket tamamlamanız gerekiyor");
        return;
      }

      console.log("🚀 [AI DEBUG] Starting AI recommendations generation...");
      console.log("🚀 [AI DEBUG] Response ID:", latestResponse.id);

      // Call AI recommendations API
      const response = await fetch("/api/generate-ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId: latestResponse.id }),
      });

      const result = await response.json();

      console.log("🚀 [AI DEBUG] API Response Status:", response.status);
      console.log("🚀 [AI DEBUG] API Response:", JSON.stringify(result, null, 2));

      if (!response.ok) {
        console.error("❌ [AI DEBUG] API Error:", result);
        throw new Error(result.error || "AI önerileri oluşturulamadı");
      }

      console.log("✅ [AI DEBUG] AI Recommendations Generated Successfully!");
      console.log("✅ [AI DEBUG] Recommendations:", JSON.stringify(result.recommendations, null, 2));

      toast.success("✅ AI önerileri başarıyla oluşturuldu!");
      
      // Reload page to show new recommendations
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error("❌ [AI DEBUG] Generate AI Recommendations Error:", error);
      console.error("❌ [AI DEBUG] Error Stack:", error.stack);
      toast.error(error.message || "AI önerileri oluşturulamadı");
    } finally {
      setIsGenerating(false);
    }
  };


  // Show empty state with button if no recommendations
  if (!loading && !recommendations) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/employee/dashboard">
                <ArrowLeft className="h-5 w-5 text-gray-900" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-orange-600" />
                Size Özel AI Önerileri
              </h1>
              <p className="mt-2 text-gray-600">
                WellScore sonuçlarınıza göre özel olarak hazırlanmış öneriler
              </p>
            </div>
          </div>

          {/* Empty State with Generate Button */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="py-12 text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Önerileriniz Henüz Hazır Değil
                </h2>
                <p className="text-gray-600 mb-2">
                  WellScore anket sonuçlarınıza göre kişiselleştirilmiş öneriler oluşturmak için butona tıklayın.
                </p>
                <p className="text-sm text-gray-500">
                  Bu işlem birkaç saniye sürebilir.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI Önerileri Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI Önerileri Oluştur
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild className="px-8 py-6 text-lg">
                  <Link href="/employee/dashboard">
                    Dashboard'a Dön
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get recommended events with full details
  const recommendedEventsWithDetails = recommendations?.recommended_events
    ?.map((rec: RecommendedEvent) => {
      const event = events.find((e: any) => e.id === rec.event_id);
      return event ? { ...event, reason: rec.reason } : null;
    })
    .filter((e: any) => e !== null) || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Safety check - if no recommendations, show empty state
  if (!recommendations) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/employee/dashboard">
                <ArrowLeft className="h-5 w-5 text-gray-900" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-orange-600" />
                Size Özel AI Önerileri
              </h1>
              <p className="mt-2 text-gray-600">
                WellScore sonuçlarınıza göre özel olarak hazırlanmış öneriler
              </p>
            </div>
          </div>

          {/* Empty State with Generate Button */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="py-12 text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Önerileriniz Henüz Hazır Değil
                </h2>
                <p className="text-gray-600 mb-2">
                  WellScore anket sonuçlarınıza göre kişiselleştirilmiş öneriler oluşturmak için butona tıklayın.
                </p>
                <p className="text-sm text-gray-500">
                  Bu işlem birkaç saniye sürebilir.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI Önerileri Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI Önerileri Oluştur
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild className="px-8 py-6 text-lg">
                  <Link href="/employee/dashboard">
                    Dashboard'a Dön
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main content with recommendations
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employee/dashboard">
              <ArrowLeft className="h-5 w-5 text-gray-900" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-orange-600" />
              Size Özel AI Önerileri
            </h1>
            <p className="mt-2 text-gray-600">
              WellScore sonuçlarınıza göre özel olarak hazırlanmış öneriler
            </p>
          </div>
        </div>

        {/* Wellbeing Tips Section */}
        {recommendations?.wellbeing_tips && Object.keys(recommendations.wellbeing_tips).length > 0 && (
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Sparkles className="h-6 w-6" />
                Wellbeing Önerileri
              </CardTitle>
              <CardDescription>
                Her boyut için kişiselleştirilmiş gelişim önerileri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(recommendations?.wellbeing_tips || {}).map(([dimension, tips]) => (
                <div key={dimension} className="bg-white rounded-lg p-4 border border-orange-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{dimension}</h3>
                  <ul className="space-y-1">
                    {tips.map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recommended Events Section */}
        {recommendations && recommendedEventsWithDetails.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-7 w-7 text-orange-600" />
                Senin İçin Önerilen Etkinlikler
              </h2>
              <p className="mt-2 text-gray-600">
                WellScore sonuçlarınıza göre senin için faydalı olacağını düşündüğümüz etkinlikler
              </p>
            </div>

            <div className="space-y-6">
              {recommendedEventsWithDetails.map((event: any) => {
                const isRequested = requestedEvents.has(event.id);
                const isRequesting = requestingEvents.has(event.id);
                const dimensionColor = event.wellbeing_dimensions?.color || "#f97316";

                return (
                  <Card
                    key={event.id}
                    className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Event Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                  borderColor: dimensionColor,
                                  color: dimensionColor,
                                }}
                              >
                                {event.wellbeing_dimensions?.name_tr || "Genel"}
                              </Badge>
                              <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Önerisi
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        {/* AI Reason */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-blue-900 text-sm mb-1">
                                Neden Bu Etkinlik?
                              </p>
                              <p className="text-sm text-blue-800">
                                {event.reason}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span>{event.event_type}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-orange-600" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-orange-200">
                          {isRequested ? (
                            <Button
                              disabled
                              className="flex-1 bg-green-50 text-green-700 border-2 border-green-500 cursor-not-allowed"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Talep Edildi
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleRequestEvent(event.id)}
                                disabled={isRequesting}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                {isRequesting ? (
                                  <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    İşleniyor...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Bu etkinliği isterim
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleDeclineEvent(event.id)}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <X className="mr-2 h-4 w-4" />
                                İstemem
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Henüz önerilen etkinlik bulunmuyor.</p>
            </CardContent>
          </Card>
        )}

        {/* Back to Dashboard */}
        <div className="text-center pt-6">
          <Button variant="outline" asChild>
            <Link href="/employee/dashboard">
              Dashboard'a Dön
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


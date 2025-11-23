// Survey Complete - Onboarding Page with Tinder-style Event Swiping
// Shows AI analysis and allows users to swipe through recommended events
'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sparkles, CheckCircle2, X, Calendar, MapPin, Heart, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
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

function SurveyCompletePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [swipedEvents, setSwipedEvents] = useState<Set<string>>(new Set()); // Track swiped events
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set()); // Track liked events
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showEvents, setShowEvents] = useState(false); // Control which step to show

  useEffect(() => {
    async function loadData() {
      if (!responseId) {
        router.push("/employee/dashboard");
        return;
      }

      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get user profile with AI recommendations
      const { data: profile } = await supabase
        .from("profiles")
        .select("ai_recommendations")
        .eq("id", user.id)
        .single();

      if (profile?.ai_recommendations) {
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
      setLoading(false);
    }

    loadData();
  }, [responseId, router]);

  // Get recommended events with full details
  const recommendedEventsWithDetails = recommendations?.recommended_events
    ?.map((rec: RecommendedEvent) => {
      const event = events.find((e: any) => e.id === rec.event_id);
      return event ? { ...event, reason: rec.reason } : null;
    })
    .filter((e: any) => e !== null) || [];

  const currentEvent = recommendedEventsWithDetails[currentEventIndex];

  // Handle swipe
  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentEvent || isSwiping) return;

    setIsSwiping(true);
    setSwipeDirection(direction);

    if (direction === 'right') {
      // Like
      setLikedEvents(prev => new Set([...prev, currentEvent.id]));
      // Request event
      requestEvent(currentEvent.id);
    } else {
      // Pass
      setSwipedEvents(prev => new Set([...prev, currentEvent.id]));
    }

    setTimeout(() => {
      if (currentEventIndex < recommendedEventsWithDetails.length - 1) {
        setCurrentEventIndex(prev => prev + 1);
      } else {
        // All events swiped, go to recommendations page
        router.push("/employee/ai-recommendations");
      }
      setIsSwiping(false);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  // Request event
  const requestEvent = async (eventId: string) => {
    try {
      const response = await fetch("/api/request-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (response.ok) {
        console.log("✅ Event requested:", eventId);
      }
    } catch (error) {
      console.error("❌ Request event error:", error);
    }
  };

  // Handle drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });

    // Auto-swipe if dragged enough
    if (Math.abs(deltaX) > 100) {
      handleSwipe(deltaX > 0 ? 'right' : 'left');
      setDragStart(null);
    }
  };

  const handleDragEnd = () => {
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">AI analiziniz hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendedEventsWithDetails.length === 0) {
    // No recommendations, redirect to AI recommendations page
    router.push("/employee/ai-recommendations");
    return null;
  }

  const progress = ((currentEventIndex + 1) / recommendedEventsWithDetails.length) * 100;
  const dimensionColor = currentEvent?.wellbeing_dimensions?.color || "#f97316";

  // Step 1: Show AI Analysis
  if (!showEvents) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Anketiniz Tamamlandı! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              AI analiziniz hazır
            </p>
          </div>

          {/* AI Analysis Summary */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Sparkles className="h-6 w-6" />
                AI Analiziniz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Genel WellScore</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {recommendations.overall_score?.toFixed(1)}/5.0
                  </span>
                </div>
                <Progress value={(recommendations.overall_score / 5) * 100} className="h-3" />
              </div>
              
              {recommendations.wellbeing_tips && Object.keys(recommendations.wellbeing_tips).length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Öne Çıkan Öneriler:</p>
                  {Object.entries(recommendations.wellbeing_tips).slice(0, 3).map(([dimension, tipData]) => {
                    // Handle both old format (array) and new format (object)
                    const isNewFormat = tipData && typeof tipData === 'object' && !Array.isArray(tipData) && 'strength_insight' in tipData;
                    const displayText = isNewFormat 
                      ? (tipData as { strength_insight: string; optional_suggestion: string }).strength_insight
                      : Array.isArray(tipData) ? tipData[0] : '';
                    
                    return (
                      <div key={dimension} className="bg-white rounded-lg p-3 border border-orange-100">
                        <p className="text-xs font-medium text-orange-900 mb-1">{dimension}</p>
                        <p className="text-xs text-gray-700">{displayText}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={() => setShowEvents(true)}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-6 text-lg font-semibold shadow-lg"
            >
              Devam Et
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              Size özel {recommendedEventsWithDetails.length} etkinlik hazırladık
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show Event Swiping
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Size Özel Etkinlikler
          </h1>
          <p className="text-lg text-gray-600">
            Beğendiğiniz etkinlikleri seçin
          </p>
        </div>

        {/* Swipe Instructions */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Sağa kaydır = İsterim • Sola kaydır = İstemem
          </p>
          <Progress value={progress} className="h-2 max-w-md mx-auto" />
          <p className="text-xs text-gray-500">
            {currentEventIndex + 1} / {recommendedEventsWithDetails.length}
          </p>
        </div>

        {/* Swipeable Event Card */}
        {currentEvent && (
          <div className="relative h-[600px] sm:h-[700px] flex items-center justify-center">
            <div
              className={`absolute w-full max-w-md transition-transform duration-300 ${
                isSwiping && swipeDirection === 'right' ? 'rotate-12 translate-x-32 opacity-0' :
                isSwiping && swipeDirection === 'left' ? '-rotate-12 -translate-x-32 opacity-0' :
                'rotate-0 translate-x-0 opacity-100'
              }`}
              style={{
                transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
                cursor: dragStart ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-2xl h-full">
                <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                  {/* Event Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: dimensionColor,
                          color: dimensionColor,
                        }}
                      >
                        {currentEvent.wellbeing_dimensions?.name_tr || "Genel"}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Önerisi
                      </Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {currentEvent.title}
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {currentEvent.description}
                    </p>
                  </div>

                  {/* AI Reason */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex-1">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 text-sm mb-1">
                          Neden Bu Etkinlik?
                        </p>
                        <p className="text-sm text-blue-800">
                          {currentEvent.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span>{currentEvent.event_type}</span>
                    </div>
                    {currentEvent.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <span>{currentEvent.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Swipe Hints */}
                  <div className="flex items-center justify-center gap-4 mt-auto pt-4 border-t border-orange-200">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full w-16 h-16 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleSwipe('left')}
                      disabled={isSwiping}
                    >
                      <XCircle className="h-8 w-8" />
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => handleSwipe('right')}
                      disabled={isSwiping}
                    >
                      <Heart className="h-8 w-8" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Skip Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/employee/ai-recommendations")}
            className="text-gray-600 hover:text-gray-900"
          >
            Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SurveyCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <SurveyCompletePageContent />
    </Suspense>
  );
}

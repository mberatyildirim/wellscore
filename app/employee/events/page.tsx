'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, TrendingDown, Users, CheckCircle, Sparkles } from "lucide-react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [requestedEventIds, setRequestedEventIds] = useState<Set<number>>(new Set());
  const [approvedEventIds, setApprovedEventIds] = useState<Set<number>>(new Set());
  const [weakDimensionIds, setWeakDimensionIds] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dimensions, setDimensions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      
      setUser(currentUser);

      // Fetch user profile
      const { data: userData } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", currentUser.id)
        .single();

      // Get all dimensions for filtering
      const { data: dimensionsData } = await supabase
        .from("wellbeing_dimensions")
        .select("id, name_tr")
        .order("order_index", { ascending: true });
      
      setDimensions(dimensionsData || []);

      // Get user's latest survey response
      const { data: latestResponse } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("user_id", currentUser.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .single();

      // Get user's dimension scores
      const { data: userScores } = await supabase
        .from("dimension_scores")
        .select("dimension_id, score")
        .eq("response_id", latestResponse?.id || "")
        .order("score", { ascending: true });

      // Get weak dimensions
      const weakDims = userScores
        ?.filter((ds: any) => ds.score < 3.5)
        .map((ds: any) => ds.dimension_id) || [];
      
      setWeakDimensionIds(weakDims);

      // Get all available events
      const { data: events } = await supabase
        .from("events")
        .select(`
          *,
          wellbeing_dimensions (
            id,
            name_tr,
            color
          )
        `)
        .order("created_at", { ascending: false });

      setAllEvents(events || []);

      // Check user's existing event requests
      const { data: userRequests } = await supabase
        .from("event_registrations")
        .select("event_id, status")
        .eq("user_id", currentUser.id);

      setRequestedEventIds(new Set(userRequests?.map((r: any) => r.event_id) || []));
      setApprovedEventIds(new Set(
        userRequests?.filter((r: any) => r.status === "approved").map((r: any) => r.event_id) || []
      ));

      setLoading(false);
    }

    loadData();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-white p-4 sm:p-6 flex items-center justify-center">
      <div className="text-center">Yükleniyor...</div>
    </div>;
  }

  // Filter events based on selected dimension
  const getFilteredEvents = () => {
    if (selectedFilter === 'all') return allEvents;
    if (selectedFilter === 'special') {
      // Special events (Fitty) - dimension_id is null
      return allEvents.filter((e: any) => e.dimension_id === null);
    }
    // Filter by dimension
    return allEvents.filter((e: any) => e.dimension_id === selectedFilter);
  };

  const filteredEvents = getFilteredEvents();

  // Separate events: special (Fitty), recommended, and other
  const specialEvents = filteredEvents?.filter((e: any) => e.dimension_id === null) || [];
  
  const recommendedEvents = filteredEvents?.filter((e: any) => 
    e.dimension_id !== null && weakDimensionIds.includes(e.dimension_id)
  ) || [];
  
  const otherEvents = filteredEvents?.filter((e: any) => 
    e.dimension_id !== null && !weakDimensionIds.includes(e.dimension_id)
  ) || [];

  // Build filter options: All + Dimensions
  const filterOptions = [
    { value: 'all', label: 'Tümü' },
    ...dimensions.map(d => ({ value: d.id, label: d.name_tr })),
    { value: 'special', label: 'Özel Hizmetler' },
  ];

  const renderEventCard = (event: any, isRecommended = false, isSpecial = false) => {
    const dimensionColor = event.wellbeing_dimensions?.color || "#6366f1";
    const isRequested = requestedEventIds.has(event.id);
    const isApproved = approvedEventIds.has(event.id);

    // Special styling for Fitty
    if (isSpecial) {
      return (
        <Card 
          key={event.id} 
          className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 via-white to-orange-50 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
        >
          {/* Special Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs sm:text-sm font-bold shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Özel Hizmet
            </Badge>
          </div>

          {/* Full Width Horizontal Layout */}
          <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
            {/* Left Section - Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start">
              <div className="relative w-40 h-16 sm:w-48 sm:h-20">
                <Image 
                  src="/fitty-logo.png" 
                  alt="Fitty" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Middle Section - Content */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-orange-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Event Type & Location Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs sm:text-sm border-orange-400 text-orange-800 bg-orange-50 font-semibold">
                  🌟 {event.event_type}
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm border-orange-300 text-orange-700">
                  📍 {event.location}
                </Badge>
              </div>
            </div>

            {/* Right Section - Action Button */}
            <div className="flex-shrink-0 flex items-center lg:w-64">
              {isApproved ? (
                <Button 
                  disabled
                  className="w-full bg-green-600 text-white text-sm sm:text-base opacity-80 cursor-not-allowed"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Etkinlik Onaylandı
                </Button>
              ) : isRequested ? (
                <Button 
                  disabled
                  className="w-full bg-green-600 text-white text-sm sm:text-base opacity-80 cursor-not-allowed"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Talep Edildi
                </Button>
              ) : (
                <form action="/api/request-event" method="POST" className="w-full">
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="user_id" value={user.id} />
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm sm:text-base font-semibold shadow-lg"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Hemen Talep Et
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Card>
      );
    }

    // Regular event card
    return (
      <Card 
        key={event.id} 
        className={`border-2 ${isRecommended ? 'border-orange-300 bg-orange-50' : 'border-border bg-card'} flex flex-col`}
      >
        <CardHeader className="pb-3">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: dimensionColor,
                color: dimensionColor 
              }}
            >
              {event.wellbeing_dimensions?.name_tr}
            </Badge>
            {isRecommended && (
              <Badge className="bg-orange-600 text-white text-xs">
                Sizin İçin Öneriliyor
              </Badge>
            )}
            {isApproved && (
              <Badge className="bg-green-600 text-white text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Onaylandı
              </Badge>
            )}
            {isRequested && !isApproved && (
              <Badge className="bg-blue-600 text-white text-xs">
                Talep Edildi
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
            {event.title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {event.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col flex-1 justify-end">
          {/* Action Button - Always at bottom */}
          <div className="mt-auto">
            {isApproved ? (
              <Button 
                disabled
                className="w-full bg-green-600 text-white text-xs sm:text-sm opacity-80 cursor-not-allowed"
                size="sm"
              >
                <CheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Etkinlik Onaylandı
              </Button>
            ) : isRequested ? (
              <Button 
                disabled
                className="w-full bg-green-600 text-white text-xs sm:text-sm opacity-80 cursor-not-allowed"
                size="sm"
              >
                <CheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Talep Edildi
              </Button>
            ) : (
              <form action="/api/request-event" method="POST">
                <input type="hidden" name="event_id" value={event.id} />
                <input type="hidden" name="user_id" value={user.id} />
                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                  size="sm"
                >
                  <Users className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Talep Et
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/employee/dashboard" style={{ color: '#6b7280' }}>
                <ArrowLeft className="mr-2 h-4 w-4" style={{ color: '#6b7280' }}/>
                Dashboard'a Dön
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <TrendingDown className="h-10 w-10 text-primary" />
              Wellbeing Etkinlikleri
            </h1>
            <p className="mt-2 text-muted-foreground">
              Size özel etkinlik önerileri ve talep imkanı
            </p>
          </div>
        </div>

        {/* Dimension Filter Tabs */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedFilter === option.value
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Special Events - Fitty (Always on Top) */}
        {specialEvents.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                Özel İş Ortağımız
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700">
                Tüm çalışanlarımız için özel olarak hazırlanmış esnek spor ve wellness çözümü
              </p>
            </div>
            {/* Full Width Container - Not Grid */}
            <div className="w-full">
              {specialEvents.map((event) => renderEventCard(event, false, true))}
            </div>
          </div>
        )}

        {/* Recommended Events */}
        {recommendedEvents.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                Sizin İçin Önerilen Etkinlikler
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Anket sonuçlarınıza göre gelişim alanlarınız için öneriler
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {recommendedEvents.map((event) => renderEventCard(event, true, false))}
            </div>
          </div>
        )}

        {/* All Other Events */}
        {otherEvents.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Diğer Etkinlikler
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Tüm wellbeing etkinliklerine göz atın
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {otherEvents.map((event) => renderEventCard(event, false, false))}
            </div>
          </div>
        )}

        {/* No Events */}
        {(!allEvents || allEvents.length === 0) && (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Henüz etkinlik bulunmuyor.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

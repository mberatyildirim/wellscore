'use client';

// HR Actions & Events Management
// Lists all available wellbeing events, shows demand analysis, and allows HR to take action
import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Users, TrendingDown, FileText, DollarSign, Mail, Sparkles } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function HRActionsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [lowScoresByDimension, setLowScoresByDimension] = useState<Record<string, number>>({});
  const [requestsByEvent, setRequestsByEvent] = useState<Record<string, number>>({});
  const [addingToPlan, setAddingToPlan] = useState<Record<string, boolean>>({});
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [plannedEventIds, setPlannedEventIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get HR profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*, companies(name)")
        .eq("id", user.id)
        .single();

      if (!profileData || profileData.role !== "hr_admin") {
        router.push("/auth/login");
        return;
      }

      setProfile(profileData);

      // Get all dimensions for filtering
      const { data: dimensionsData } = await supabase
        .from("wellbeing_dimensions")
        .select("id, name_tr")
        .order("order_index", { ascending: true });
      
      setDimensions(dimensionsData || []);

      // Fetch all events
      const { data: eventsData } = await supabase
        .from("events")
        .select(`
          *,
          wellbeing_dimensions(id, name_tr, color)
        `)
        .order("created_at", { ascending: false });

      setEvents(eventsData || []);

      // Get dimension scores
      const { data: dimensionScores } = await supabase
        .from("dimension_scores")
        .select(`
          dimension_id,
          score,
          survey_responses!inner(
            id,
            profiles!inner(company_id)
          )
        `)
        .eq("survey_responses.profiles.company_id", profileData.company_id);

      // Calculate low scores
      const lowScores: Record<string, number> = {};
      dimensionScores?.forEach((ds: any) => {
        if (ds.score < 3.0) {
          lowScores[ds.dimension_id] = (lowScores[ds.dimension_id] || 0) + 1;
        }
      });
      setLowScoresByDimension(lowScores);

      // Get registrations
      const { data: registrations, error: regError } = await supabase
        .from("event_registrations")
        .select(`
          event_id,
          status,
          user_id,
          profiles!inner(company_id)
        `)
        .eq("profiles.company_id", profileData.company_id)
        .eq("status", "requested");

      console.log('[HR Actions] Event registrations:', registrations);
      console.log('[HR Actions] Registration error:', regError);
      console.log('[HR Actions] Company ID:', profileData.company_id);

      const requests: Record<string, number> = {};
      registrations?.forEach((reg: any) => {
        requests[reg.event_id] = (requests[reg.event_id] || 0) + 1;
      });
      console.log('[HR Actions] Requests by event:', requests);
      setRequestsByEvent(requests);

      // Get planned events (event_plans table)
      const { data: eventPlans } = await supabase
        .from("event_plans")
        .select("event_id")
        .eq("company_id", profileData.company_id)
        .in("status", ["draft", "quote_requested", "approved"]);

      const plannedIds = new Set(eventPlans?.map((ep: any) => ep.event_id) || []);
      setPlannedEventIds(plannedIds);
      console.log('[HR Actions] Planned event IDs:', plannedIds);

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
    if (selectedFilter === 'all') return events;
    if (selectedFilter === 'special') {
      // Special events (Fitty) - dimension_id is null
      return events.filter((e: any) => e.dimension_id === null);
    }
    // Filter by dimension
    return events.filter((e: any) => e.dimension_id === selectedFilter);
  };

  const filteredEvents = getFilteredEvents();
  const specialEvents = filteredEvents?.filter((e: any) => e.dimension_id === null) || [];
  const regularEvents = filteredEvents?.filter((e: any) => e.dimension_id !== null) || [];

  // Handle adding event to plan
  const handleAddToPlan = async (eventId: string) => {
    setAddingToPlan(prev => ({ ...prev, [eventId]: true }));
    
    try {
      const response = await fetch('/api/add-to-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Plana eklenirken hata oluştu');
      }

      toast.success('✅ Etkinlik planlarınıza eklendi!');
      // Add to plannedEventIds
      setPlannedEventIds(prev => new Set([...prev, eventId]));
    } catch (error: any) {
      console.error('[Add to Plan Error]:', error);
      toast.error(error.message || 'Plana eklenirken hata oluştu');
    } finally {
      setAddingToPlan(prev => ({ ...prev, [eventId]: false }));
    }
  };

  // Build filter options: All + Dimensions
  const filterOptions = [
    { value: 'all', label: 'Tümü' },
    ...dimensions.map(d => ({ value: d.id, label: d.name_tr })),
    { value: 'special', label: 'Kapsamlı Çözümler' },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/hr/dashboard" style={{ color: '#6b7280' }}>
                <ArrowLeft className="mr-2 h-4 w-4" style={{ color: '#6b7280' }}/>
                Dashboard'a Dön
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="h-10 w-10 text-primary" />
              HR Aksiyonları & Etkinlikler
            </h1>
            <p className="mt-2 text-muted-foreground">
              Çalışan iyi oluşu için etkinlikler düzenleyin ve takip edin
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
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                Özel İş Ortağımız
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700">
                Tüm çalışanlarınız için özel olarak hazırlanmış esnek spor ve wellness çözümü
              </p>
            </div>
            {/* Full Width Container - Not Grid */}
            <div className="w-full">
              {specialEvents.map((event: any) => {
                const requestCount = requestsByEvent[event.id] || 0;
                
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

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg border border-orange-200">
                            <Users className="h-4 w-4 text-orange-700" />
                            <span className="text-sm font-medium text-orange-900">Tüm Boyutlar İçin</span>
                            <span className="text-sm font-bold text-orange-700">✨ Evrensel</span>
                          </div>
                          
                          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                            <TrendingDown className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Talep:</span>
                            <span className="text-sm font-bold text-blue-600">{requestCount} çalışan</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex-shrink-0 flex flex-col justify-between gap-3 lg:w-64">
                        <div className="flex items-center gap-2 text-sm text-gray-700 justify-center lg:justify-start">
                          <Mail className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Şirketinize özel fiyatlandırma</span>
                        </div>

                        {/* Teklif Al Button */}
                        <Button 
                          variant="outline" 
                          className="w-full text-sm sm:text-base border-2 border-orange-500 text-orange-700 hover:bg-orange-50 font-semibold"
                          size="lg"
                          asChild
                        >
                          <a href={`mailto:info@wellscore.co?subject=Fitty İş Birliği Teklif Talebi`}>
                            <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Teklif Al
                          </a>
                        </Button>

                        {/* Plana Ekle Button */}
                        {plannedEventIds.has(event.id) ? (
                          <Button 
                            variant="outline" 
                            className="w-full text-sm sm:text-base border-2 border-green-500 text-green-700 bg-green-50 font-semibold cursor-not-allowed"
                            size="lg"
                            disabled
                          >
                            <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            ✓ Planlandı
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            className="w-full text-sm sm:text-base bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                            size="lg"
                            onClick={() => handleAddToPlan(event.id)}
                            disabled={addingToPlan[event.id]}
                          >
                            <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            {addingToPlan[event.id] ? 'Ekleniyor...' : 'Plana Ekle'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Events Grid */}
        {regularEvents && regularEvents.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Diğer Etkinlikler
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Wellbeing boyutlarına göre özelleştirilmiş etkinlikler
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {regularEvents.map((event: any) => {
                const needCount = lowScoresByDimension[event.dimension_id] || 0;
                const requestCount = requestsByEvent[event.id] || 0;
                const dimensionColor = event.wellbeing_dimensions?.color || "#6366f1";

                return (
                  <Card key={event.id} className="border-border hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader className="pb-3">
                      {/* Dimension Badge */}
                      <div className="mb-2">
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
                      </div>
                      
                      <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-4">
                        {/* Stats */}
                        <div className="space-y-2">
                          {/* Need Analysis */}
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                              <span className="text-xs sm:text-sm font-medium text-orange-900">İhtiyaç</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-orange-600">
                              {needCount} çalışan
                            </span>
                          </div>
                          
                          {/* Request Count */}
                          <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                              <span className="text-xs sm:text-sm font-medium text-blue-900">Talep</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-blue-600">
                              {requestCount} çalışan
                            </span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="pt-3 border-t border-border">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>Fiyatlandırma:</span>
                            </div>
                            <div className="text-sm sm:text-base font-semibold text-orange-600">
                              Şirketinize Özel Fiyat
                            </div>
                            <div className="text-xs text-muted-foreground">
                              x TL (Sabit) + y TL × Kişi Sayısı
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button - Always at bottom */}
                      <div className="mt-auto">
                        {plannedEventIds.has(event.id) ? (
                          <Button 
                            variant="outline" 
                            className="w-full text-xs sm:text-sm border-2 border-green-500 text-green-700 bg-green-50 cursor-not-allowed"
                            size="sm"
                            disabled
                          >
                            <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            ✓ Planlandı
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            className="w-full text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white"
                            size="sm"
                            onClick={() => handleAddToPlan(event.id)}
                            disabled={addingToPlan[event.id]}
                          >
                            <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            {addingToPlan[event.id] ? 'Ekleniyor...' : 'Plana Ekle'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Henüz etkinlik tanımlanmamış.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


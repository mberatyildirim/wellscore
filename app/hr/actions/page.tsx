// HR Actions & Events Management
// Lists all available wellbeing events, shows demand analysis, and allows HR to take action
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Users, TrendingDown, FileText, DollarSign, Mail, Sparkles } from "lucide-react";

export default async function HRActionsPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get HR profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, companies(name)")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "hr_admin") redirect("/auth/login");

  // Fetch all events with dimension info
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      wellbeing_dimensions(id, name_tr, color)
    `)
    .order("created_at", { ascending: false });

  // Get all dimension scores for company employees to calculate need
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
    .eq("survey_responses.profiles.company_id", profile.company_id);

  // Calculate employees with low scores per dimension (score < 3.0)
  const lowScoresByDimension: Record<string, number> = {};
  dimensionScores?.forEach((ds: any) => {
    if (ds.score < 3.0) {
      lowScoresByDimension[ds.dimension_id] = (lowScoresByDimension[ds.dimension_id] || 0) + 1;
    }
  });

  // Get event registration requests for this company
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select(`
      event_id,
      profiles!inner(company_id)
    `)
    .eq("profiles.company_id", profile.company_id)
    .eq("status", "requested");

  // Count requests per event
  const requestsByEvent: Record<string, number> = {};
  registrations?.forEach((reg: any) => {
    requestsByEvent[reg.event_id] = (requestsByEvent[reg.event_id] || 0) + 1;
  });

  // Separate special events (Fitty) from regular events
  const specialEvents = events?.filter((e: any) => e.dimension_id === null) || [];
  const regularEvents = events?.filter((e: any) => e.dimension_id !== null) || [];

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
                      <div className="flex-shrink-0 flex flex-col justify-between gap-4 lg:w-64">
                        <div className="flex items-center gap-2 text-sm text-gray-700 justify-center lg:justify-start">
                          <Mail className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Şirketinize özel fiyatlandırma</span>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full text-sm sm:text-base border-2 border-orange-500 text-orange-700 hover:bg-orange-50 font-semibold"
                          size="lg"
                          asChild
                        >
                          <a href={`mailto:info@wellscore.com?subject=Fitty İş Birliği Teklif Talebi`}>
                            <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Teklif Al
                          </a>
                        </Button>
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
                const hasPrice = event.base_price !== null && event.per_person_price !== null;
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
                          {hasPrice ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>Fiyatlandırma:</span>
                              </div>
                              <div className="text-sm sm:text-base font-semibold text-foreground">
                                {event.base_price.toLocaleString('tr-TR')} ₺ + {event.per_person_price.toLocaleString('tr-TR')} ₺/kişi
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>Fiyat için teklif alın</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button - Always at bottom */}
                      <div className="mt-auto">
                        {hasPrice ? (
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                            size="sm"
                          >
                            <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Etkinlik Düzenle
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="w-full text-xs sm:text-sm"
                            size="sm"
                            asChild
                          >
                            <a href={`mailto:info@wellscore.com?subject=Teklif Talebi: ${event.title}`}>
                              <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              Teklif Al
                            </a>
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


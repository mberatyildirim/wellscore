import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, TrendingDown, Users, CheckCircle } from "lucide-react";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user profile to get their company_id
  const { data: userData } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  // Get user's latest survey response to identify weak dimensions
  const { data: latestResponse } = await supabase
    .from("survey_responses")
    .select("id")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  // Get user's dimension scores (to recommend events)
  const { data: userScores } = await supabase
    .from("dimension_scores")
    .select("dimension_id, score")
    .eq("response_id", latestResponse?.id || "")
    .order("score", { ascending: true });

  // Get weak dimensions (score < 3.5)
  const weakDimensionIds = userScores
    ?.filter((ds: any) => ds.score < 3.5)
    .map((ds: any) => ds.dimension_id) || [];

  // Get all available events
  const { data: allEvents } = await supabase
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

  // Check user's existing event requests
  const { data: userRequests } = await supabase
    .from("event_registrations")
    .select("event_id, status")
    .eq("user_id", user.id);

  const requestedEventIds = new Set(userRequests?.map((r: any) => r.event_id) || []);
  const approvedEventIds = new Set(
    userRequests?.filter((r: any) => r.status === "approved").map((r: any) => r.event_id) || []
  );

  // Separate events into recommended and other
  const recommendedEvents = allEvents?.filter((e: any) => 
    weakDimensionIds.includes(e.dimension_id)
  ) || [];
  
  const otherEvents = allEvents?.filter((e: any) => 
    !weakDimensionIds.includes(e.dimension_id)
  ) || [];

  const renderEventCard = (event: any, isRecommended = false) => {
    const dimensionColor = event.wellbeing_dimensions?.color || "#6366f1";
    const isRequested = requestedEventIds.has(event.id);
    const isApproved = approvedEventIds.has(event.id);

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
              <Link href="/employee/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
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
              {recommendedEvents.map((event) => renderEventCard(event, true))}
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
              {otherEvents.map((event) => renderEventCard(event, false))}
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

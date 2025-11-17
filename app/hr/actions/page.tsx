// HR Actions & Events Management
// Lists all available wellbeing events, shows demand analysis, and allows HR to take action
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, TrendingDown, FileText, DollarSign, Mail } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/hr/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
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

        {/* Events Grid */}
        {events && events.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event: any) => {
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


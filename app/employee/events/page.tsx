import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user profile to get their company_id (from profiles table)
  const { data: userData } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  // Get all upcoming events
  const now = new Date().toISOString();
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr
      )
    `)
    .eq("company_id", userData?.company_id)
    .gte("start_time", now)
    .order("start_time", { ascending: true });

  // Get past events
  const { data: pastEvents } = await supabase
    .from("events")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr
      )
    `)
    .eq("company_id", userData?.company_id)
    .lt("start_time", now)
    .order("start_time", { ascending: false })
    .limit(10);

  const renderEventCard = (event: any, isPast = false) => (
    <Card key={event.id} className={`border-border ${isPast ? "bg-muted/50" : "bg-card"}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-card-foreground">{event.title}</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {event.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tarih:</span>
            <span className="font-medium text-foreground">
              {new Date(event.start_time).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Saat:</span>
            <span className="font-medium text-foreground">
              {new Date(event.start_time).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(event.end_time).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Konum:</span>
              <span className="font-medium text-foreground">{event.location}</span>
            </div>
          )}
          {event.capacity && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Kapasite:</span>
              <span className="font-medium text-foreground">{event.capacity} kişi</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-border text-foreground">
            {event.event_type === "physical" ? "Fiziksel" :
             event.event_type === "online" ? "Online" : "Hibrit"}
          </Badge>
          {event.wellbeing_dimensions && (
            <Badge className="bg-accent text-accent-foreground">
              {event.wellbeing_dimensions.name_tr}
            </Badge>
          )}
          {isPast && (
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              Tamamlandı
            </Badge>
          )}
        </div>

        {!isPast && event.meeting_url && (
          <Button asChild className="w-full bg-primary text-primary-foreground">
            <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
              Etkinliğe Katıl
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Etkinlik Takvimi
            </h1>
            <p className="mt-2 text-muted-foreground">
              Wellbeing etkinliklerine katılın
            </p>
          </div>
          <Button asChild variant="outline" className="border-border">
            <Link href="/employee/library">
              Kütüphaneye Dön
            </Link>
          </Button>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Yaklaşan Etkinlikler
            </h2>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => renderEventCard(event, false))}
              </div>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Yaklaşan etkinlik bulunmuyor</p>
                </CardContent>
              </Card>
            )}
          </div>

          {pastEvents && pastEvents.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Geçmiş Etkinlikler
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => renderEventCard(event, true))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

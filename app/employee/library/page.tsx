import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Get all wellbeing content
  const { data: content } = await supabase
    .from("wellbeing_content")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr
      )
    `)
    .order("created_at", { ascending: false });

  // Get user's assigned content
  const { data: assignedContent } = await supabase
    .from("content_assignments")
    .select("content_id, completed")
    .eq("user_id", user.id);

  const assignedContentMap = new Map(
    assignedContent?.map((a) => [a.content_id, a.completed]) || []
  );

  // Get upcoming events
  const now = new Date().toISOString();
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr
      )
    `)
    .gte("start_time", now)
    .order("start_time", { ascending: true });

  // Filter content by type
  const articles = content?.filter((c) => c.content_type === "article") || [];
  const videos = content?.filter((c) => c.content_type === "video") || [];
  const workshops = content?.filter((c) => c.content_type === "workshop") || [];

  const renderContentCard = (item: any) => {
    const isAssigned = assignedContentMap.has(item.id);
    const isCompleted = assignedContentMap.get(item.id);

    return (
      <Card key={item.id} className="border-border bg-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-card-foreground">{item.title}</CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                {item.description}
              </CardDescription>
            </div>
            {item.thumbnail_url && (
              <img
                src={item.thumbnail_url || "/placeholder.svg"}
                alt={item.title}
                className="ml-4 h-20 w-20 rounded object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {item.content_type === "article" ? "Makale" :
                 item.content_type === "video" ? "Video" :
                 item.content_type === "workshop" ? "Workshop" :
                 item.content_type === "webinar" ? "Webinar" : "Egzersiz"}
              </Badge>
              {item.wellbeing_dimensions && (
                <Badge variant="outline" className="border-border text-foreground">
                  {item.wellbeing_dimensions.name_tr}
                </Badge>
              )}
              {item.duration_minutes && (
                <Badge variant="outline" className="border-border text-foreground">
                  {item.duration_minutes} dk
                </Badge>
              )}
              {isAssigned && (
                <Badge className="bg-primary text-primary-foreground">
                  {isCompleted ? "Tamamlandı" : "Size özel"}
                </Badge>
              )}
            </div>
            {item.url && (
              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  İncele
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Wellbeing Kütüphanesi
            </h1>
            <p className="mt-2 text-muted-foreground">
              Wellbeing yolculuğunuz için içerikler ve etkinlikler
            </p>
          </div>
          <Button asChild variant="outline" className="border-border">
            <Link href="/employee/events">
              Etkinlik Takvimi
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="articles">Makaleler</TabsTrigger>
            <TabsTrigger value="videos">Videolar</TabsTrigger>
            <TabsTrigger value="workshops">Workshop & Webinar</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {content && content.length > 0 ? (
              content.map(renderContentCard)
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Henüz içerik eklenmemiş</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            {articles.length > 0 ? (
              articles.map(renderContentCard)
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Henüz makale eklenmemiş</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {videos.length > 0 ? (
              videos.map(renderContentCard)
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Henüz video eklenmemiş</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workshops" className="space-y-4">
            {workshops.length > 0 ? (
              workshops.map(renderContentCard)
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Henüz workshop eklenmemiş</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {events && events.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Yaklaşan Etkinlikler</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((event: any) => (
                <Card key={event.id} className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">{event.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Tarih:</span>
                        <span className="text-foreground">
                          {new Date(event.start_time).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Tip:</span>
                        <Badge variant="outline" className="border-border text-foreground">
                          {event.event_type === "physical" ? "Fiziksel" :
                           event.event_type === "online" ? "Online" : "Hibrit"}
                        </Badge>
                      </div>
                      {event.wellbeing_dimensions && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>Boyut:</span>
                          <Badge className="bg-accent text-accent-foreground">
                            {event.wellbeing_dimensions.name_tr}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="border-border">
                <Link href="/employee/events">
                  Tüm Etkinlikleri Gör
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

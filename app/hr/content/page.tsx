import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HRContentPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user profile to check role and company (from profiles table)
  const { data: userData } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "hr_admin") {
    redirect("/employee/dashboard");
  }

  // Get all content
  const { data: content } = await supabase
    .from("wellbeing_content")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr
      )
    `)
    .order("created_at", { ascending: false });

  // Get all events for this company
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      wellbeing_dimensions (
        name_tr
      )
    `)
    .eq("company_id", userData.company_id)
    .order("start_time", { ascending: false });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            İçerik Yönetimi
          </h1>
          <p className="mt-2 text-muted-foreground">
            Wellbeing içerikleri ve etkinlikleri yönetin
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Toplam İçerik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{content?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Toplam Etkinlik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{events?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Yaklaşan Etkinlik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {events?.filter((e) => new Date(e.start_time) > new Date()).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">İçerik & Etkinlik Yönetimi</CardTitle>
            <CardDescription className="text-muted-foreground">
              Not: İçerik ve etkinlik ekleme özellikleri yakında eklenecek
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              İK yöneticileri için içerik ve etkinlik ekleme, düzenleme ve atama özellikleri
              geliştirme aşamasındadır.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

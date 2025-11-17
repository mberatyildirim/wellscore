// Employee Dashboard - PRD Compliant
// Displays personal wellbeing scores, recommendations, and insights
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Activity, Brain, Heart, Users, Briefcase, DollarSign, Home, Target, BookOpen, ArrowRight } from "lucide-react";

// Icon mapping for dimensions
const dimensionIcons: Record<string, any> = {
  'Physical Health': Activity,
  'Mental Health': Brain,
  'Emotional Wellbeing': Heart,
  'Social Connections': Users,
  'Career Satisfaction': Briefcase,
  'Financial Security': DollarSign,
  'Environmental Factors': Home,
  'Purpose and Meaning': Target,
};

// Score interpretation helper
const getScoreCategory = (score: number) => {
  if (score >= 4.5) return { label: "Mükemmel", color: "text-green-600", bgColor: "bg-green-50" };
  if (score >= 4.0) return { label: "Çok İyi", color: "text-green-500", bgColor: "bg-green-50" };
  if (score >= 3.5) return { label: "İyi", color: "text-blue-500", bgColor: "bg-blue-50" };
  if (score >= 3.0) return { label: "Orta", color: "text-yellow-500", bgColor: "bg-yellow-50" };
  if (score >= 2.5) return { label: "Geliştirilmeli", color: "text-orange-500", bgColor: "bg-orange-50" };
  return { label: "Dikkat Gerekli", color: "text-red-500", bgColor: "bg-red-50" };
};

export default async function EmployeeDashboardPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  // Get latest survey response
  const { data: latestResponse } = await supabase
    .from("survey_responses")
    .select("id, completed_at, overall_score")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  // If no survey, show welcome screen
  if (!latestResponse) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">
              Hoş geldiniz, {profile.full_name}! 👋
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Wellbeing yolculuğunuza başlamaya hazır mısınız?
            </p>
          </div>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">WellScore Değerlendirmenizi Yapın</CardTitle>
              <CardDescription className="text-base mt-2">
                8 boyutta wellbeing durumunuzu değerlendirin ve kişiselleştirilmiş öneriler alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Fiziksel', 'Zihinsel', 'Duygusal', 'Sosyal', 'Kariyer', 'Finansal', 'Çevresel', 'Amaç'].map((dim) => (
                  <div key={dim} className="flex flex-col items-center p-3 rounded-lg bg-background border border-border">
                    <span className="text-2xl mb-1">✓</span>
                    <span className="text-xs text-center text-muted-foreground">{dim}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-accent/30 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">Bu değerlendirme:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 40 soru (8 boyut x 5 soru)</li>
                  <li>• Yaklaşık 10 dakika</li>
                  <li>• Tamamen gizli ve anonim</li>
                  <li>• Kişiselleştirilmiş öneriler</li>
                </ul>
              </div>

              <Button asChild className="w-full h-12 text-lg" size="lg">
                <Link href="/employee/survey">
                  <Activity className="mr-2 h-5 w-5" />
                  Anketi Başlat
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get dimension scores
  const { data: dimensionScoresData } = await supabase
    .from("dimension_scores")
    .select(`
      score,
        wellbeing_dimensions (
          id,
          name,
        name_tr,
        color,
        icon
      )
    `)
    .eq("response_id", latestResponse.id)
    .order("wellbeing_dimensions(order_index)", { ascending: true });

  const dimensionScores = dimensionScoresData?.map((item: any) => ({
    id: item.wellbeing_dimensions.id,
    name: item.wellbeing_dimensions.name,
    name_tr: item.wellbeing_dimensions.name_tr,
    color: item.wellbeing_dimensions.color,
    score: item.score,
  })) || [];

  const overallScore = latestResponse.overall_score || 0;
  const overallCategory = getScoreCategory(overallScore);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Merhaba, {profile.full_name} 👋
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Son değerlendirme: {new Date(latestResponse.completed_at).toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <Link href="/employee/survey">
              Yeni Değerlendirme
            </Link>
          </Button>
        </div>

        {/* Overall Score Hero Card */}
        <Card className={`border-2 shadow-xl ${overallCategory.bgColor} border-${overallCategory.color.split('-')[1]}-200`}>
          <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="text-5xl sm:text-7xl font-bold" style={{ color: overallCategory.color.replace('text-', '') }}>
                    {overallScore.toFixed(1)}
                  </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">/ 5.0</div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">Genel WellScore'unuz</h2>
                <Badge className={`${overallCategory.color} text-base sm:text-lg px-3 py-1`} variant="outline">
                  {overallCategory.label}
                </Badge>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  {overallScore >= 4.0 
                    ? "Harika! Genel wellbeing durumunuz çok iyi seviyede." 
                    : overallScore >= 3.0 
                    ? "İyi bir performans gösteriyorsunuz. Bazı alanlarda iyileştirme yapabilirsiniz."
                    : "Bazı alanlarda destek gerekebilir. Önerilerimizi inceleyin."}
                </p>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* Dimension Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dimensionScores.map((dimension: any) => {
            const Icon = dimensionIcons[dimension.name] || Activity;
            const category = getScoreCategory(dimension.score);
            const percentage = (dimension.score / 5) * 100;
            
            return (
              <Card key={dimension.id} className="border-border hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: dimension.color + '20' }}>
                        <Icon className="h-5 w-5" style={{ color: dimension.color }} />
                    </div>
                    </div>
                    <Badge variant="outline" className={`${category.color} text-xs`}>
                      {category.label}
                    </Badge>
            </div>
                  <CardTitle className="text-base mt-2">{dimension.name_tr}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{dimension.score.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {dimension.score >= 4.0 
                      ? "Güçlü bir alan 💪" 
                      : dimension.score >= 3.0 
                      ? "Gelişim devam ediyor 📈"
                      : "Odaklanma gerekiyor 🎯"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                İçerik Kütüphanesi
              </CardTitle>
              <CardDescription>
                Size özel wellbeing içerikleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/employee/library">
                  İçerikleri Görüntüle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Etkinlikler
              </CardTitle>
              <CardDescription>
                Yaklaşan wellbeing etkinlikleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/employee/events">
                  Etkinliklere Göz At
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Kişisel Öneriler
              </CardTitle>
              <CardDescription>
                AI destekli gelişim önerileri
                </CardDescription>
              </CardHeader>
              <CardContent>
              <Button className="w-full">
                Önerileri Gör
                <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

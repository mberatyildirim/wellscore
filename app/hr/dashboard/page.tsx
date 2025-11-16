// HR Admin Dashboard - PRD Compliant
// Company-wide analytics, KPIs, employee management
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Users, TrendingUp, AlertTriangle, CheckCircle, Activity, Building2, UserPlus, Download, BarChart3, ArrowRight, Target } from "lucide-react";

// Score category helper
const getScoreCategory = (score: number) => {
  if (score >= 4.0) return { label: "İyi", color: "text-green-600", bgColor: "bg-green-50" };
  if (score >= 3.0) return { label: "Orta", color: "text-yellow-600", bgColor: "bg-yellow-50" };
  return { label: "Düşük", color: "text-red-600", bgColor: "bg-red-50" };
};

export default async function HRDashboardPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get HR profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, companies(name, industry, employee_count)")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "hr_admin") redirect("/auth/login");

  const company = profile.companies;

  // Get all employees in company
  const { data: employees } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_active, created_at")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(e => e.is_active).length || 0;

  // Get all survey responses for company
  const { data: allResponses } = await supabase
    .from("survey_responses")
    .select(`
      id,
      user_id,
      overall_score,
      completed_at,
      profiles!inner(company_id)
    `)
    .eq("profiles.company_id", profile.company_id);

  const totalResponses = allResponses?.length || 0;
  const participationRate = totalEmployees > 0 ? (totalResponses / totalEmployees) * 100 : 0;

  // Calculate company average score
  const companyAverageScore = allResponses && allResponses.length > 0
    ? allResponses.reduce((sum, r) => sum + (r.overall_score || 0), 0) / allResponses.length
    : 0;

  const scoreCategory = getScoreCategory(companyAverageScore);

  // Get dimension-level insights
  const { data: allDimensionScores } = await supabase
    .from("dimension_scores")
    .select(`
      score,
      wellbeing_dimensions(id, name, name_tr, color),
      survey_responses!inner(
        id,
        profiles!inner(company_id)
      )
    `)
    .eq("survey_responses.profiles.company_id", profile.company_id);

  // Calculate average per dimension
  const dimensionAverages = allDimensionScores?.reduce((acc: any, item: any) => {
    const dimId = item.wellbeing_dimensions.id;
    if (!acc[dimId]) {
      acc[dimId] = {
        id: dimId,
        name_tr: item.wellbeing_dimensions.name_tr,
        color: item.wellbeing_dimensions.color,
        scores: [],
      };
    }
    acc[dimId].scores.push(item.score);
    return acc;
  }, {});

  const dimensionStats = Object.values(dimensionAverages || {}).map((dim: any) => ({
    ...dim,
    average: dim.scores.reduce((sum: number, s: number) => sum + s, 0) / dim.scores.length,
  })).sort((a: any, b: any) => a.average - b.average);

  // Identify at-risk employees (overall score < 3.0)
  const atRiskCount = allResponses?.filter(r => r.overall_score && r.overall_score < 3.0).length || 0;

  // Recent employees (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentEmployees = employees?.filter(e => new Date(e.created_at) > sevenDaysAgo).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Building2 className="h-10 w-10 text-primary" />
              {company?.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {company?.industry} • {company?.employee_count} Çalışan
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/hr/employees">
                <Users className="mr-2 h-4 w-4" />
                Çalışanlar
              </Link>
            </Button>
            <Button asChild>
              <Link href="/hr/invite">
                <UserPlus className="mr-2 h-4 w-4" />
                Çalışan Ekle
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Employees */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Çalışan
                </CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEmployees}</div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {activeEmployees} aktif
                </Badge>
                {recentEmployees > 0 && (
                  <span className="text-xs text-green-600">
                    +{recentEmployees} bu hafta
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participation Rate */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Katılım Oranı
                </CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{participationRate.toFixed(0)}%</div>
              <Progress value={participationRate} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {totalResponses} / {totalEmployees} değerlendirme
              </p>
            </CardContent>
          </Card>

          {/* Company Average Score */}
          <Card className={`border-2 ${scoreCategory.bgColor}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ortalama WellScore
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${scoreCategory.color}`}>
                  {companyAverageScore.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
              <Badge variant="outline" className={`mt-2 ${scoreCategory.color}`}>
                {scoreCategory.label}
              </Badge>
            </CardContent>
          </Card>

          {/* At-Risk Employees */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Dikkat Gereken
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{atRiskCount}</div>
              <p className="mt-2 text-xs text-muted-foreground">
                {atRiskCount > 0 
                  ? "Düşük skor (<3.0)" 
                  : "Harika! Herkes iyi durumda ✓"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dimension Analysis */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Wellbeing Boyutları Analizi
            </CardTitle>
            <CardDescription>
              Şirket genelinde en güçlü ve geliştirilmesi gereken alanlar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dimensionStats.length > 0 ? (
              dimensionStats.map((dim: any, index: number) => {
                const percentage = (dim.average / 5) * 100;
                const isLowest = index === 0;
                const isHighest = index === dimensionStats.length - 1;
                
                return (
                  <div key={dim.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: dim.color }}
                        />
                        <span className="font-medium">{dim.name_tr}</span>
                        {isLowest && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            Gelişim Alanı
                          </Badge>
                        )}
                        {isHighest && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            En Güçlü
                          </Badge>
                        )}
                      </div>
                      <span className="text-lg font-bold">
                        {dim.average.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Henüz veri yok. Çalışanları ankete davet edin!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Çalışan Davet Et
              </CardTitle>
              <CardDescription>
                Tek tek veya toplu CSV ile ekleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/hr/invite">
                  Davet Gönder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                HR Aksiyonları
              </CardTitle>
              <CardDescription>
                AI destekli iyileştirme önerileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/hr/actions">
                  Önerileri Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Raporlar
              </CardTitle>
              <CardDescription>
                Detaylı analizleri indirin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/hr/reports">
                  Raporlara Git
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

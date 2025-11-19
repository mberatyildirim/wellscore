// HR Admin Dashboard - PRD Compliant
// Company-wide analytics, KPIs, employee management
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Users, TrendingUp, AlertTriangle, CheckCircle, Activity, Building2, UserPlus, Download, BarChart3, ArrowRight, Target, Heart, Calendar } from "lucide-react";

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
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              {company?.name}
          </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {totalEmployees} kayıtlı çalışan
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Link href="/hr/employees" style={{ color: '#6b7280' }}>
                <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Çalışanlar
              </Link>
            </Button>
            {/* Çalışan Ekle butonu yorum satırına alındı - erişim kapatıldı */}
            {/* <Button asChild size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Link href="/hr/invite">
                <UserPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Çalışan Ekle
              </Link>
            </Button> */}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Dimension Analysis - Individual Cards */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Wellbeing Boyutları Analizi
            </h2>
            <p className="mt-2 text-muted-foreground">
              Şirket genelinde en güçlü ve geliştirilmesi gereken alanlar
            </p>
          </div>

          {dimensionStats.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dimensionStats.map((dim: any) => {
                const score = dim.average;
                const percentage = (score / 5) * 100;
                
                // Dynamic styling based on score (red to green gradient)
                let gradientFrom = "from-emerald-500";
                let gradientTo = "to-green-500";
                let bgGradient = "bg-gradient-to-br from-emerald-50 to-green-50";
                let borderColor = "border-green-400/50";
                let textColor = "text-green-700";
                let glowColor = "shadow-green-500/20";
                let progressColor = "bg-gradient-to-r from-green-400 to-emerald-500";
                let statusLabel = "Mükemmel";
                let ringColor = "ring-green-500/20";
                
                if (score < 2.5) {
                  gradientFrom = "from-red-500";
                  gradientTo = "to-rose-500";
                  bgGradient = "bg-gradient-to-br from-red-50 to-rose-50";
                  borderColor = "border-red-400/50";
                  textColor = "text-red-700";
                  glowColor = "shadow-red-500/20";
                  progressColor = "bg-gradient-to-r from-red-400 to-rose-500";
                  statusLabel = "Kritik";
                  ringColor = "ring-red-500/20";
                } else if (score < 3.5) {
                  gradientFrom = "from-orange-500";
                  gradientTo = "to-amber-500";
                  bgGradient = "bg-gradient-to-br from-orange-50 to-amber-50";
                  borderColor = "border-orange-400/50";
                  textColor = "text-orange-700";
                  glowColor = "shadow-orange-500/20";
                  progressColor = "bg-gradient-to-r from-orange-400 to-amber-500";
                  statusLabel = "Gelişmeli";
                  ringColor = "ring-orange-500/20";
                } else if (score < 4.5) {
                  gradientFrom = "from-yellow-500";
                  gradientTo = "to-amber-400";
                  bgGradient = "bg-gradient-to-br from-yellow-50 to-amber-50";
                  borderColor = "border-yellow-400/50";
                  textColor = "text-yellow-700";
                  glowColor = "shadow-yellow-500/20";
                  progressColor = "bg-gradient-to-r from-yellow-400 to-amber-400";
                  statusLabel = "İyi";
                  ringColor = "ring-yellow-500/20";
                }
                
                return (
                  <Card 
                    key={dim.id} 
                    className={`group relative overflow-hidden border-2 ${borderColor} ${bgGradient} flex flex-col transition-all duration-300 hover:shadow-xl ${glowColor} hover:-translate-y-1 hover:ring-4 ${ringColor}`}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000" />
                    
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${textColor.replace('text-', 'bg-')} animate-pulse`} />
                            <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                              {dim.name_tr}
                            </CardTitle>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex flex-col flex-1 justify-between space-y-4 relative z-10">
                      <div className="space-y-4">
                        {/* Score Display */}
                        <div className="flex items-baseline gap-2">
                          <span className={`text-4xl sm:text-5xl font-black ${textColor} tracking-tight`}>
                            {score.toFixed(1)}
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground font-medium">/ 5.0</span>
                        </div>
                        
                        {/* Animated Progress Bar */}
                        <div className="space-y-2">
                          <div className="relative h-3 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <div 
                              className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                              style={{ width: `${percentage}%` }}
                            >
                              {/* Shine animation on progress bar */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="secondary" 
                              className={`${textColor} font-semibold text-xs px-2 py-0.5 bg-white/80 backdrop-blur-sm`}
                            >
                              {statusLabel}
                            </Badge>
                            <span className="text-xs font-medium text-muted-foreground">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Improve Button - Always at bottom with gradient */}
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 mt-auto group/btn"
                        size="sm"
                      >
                        <Link href={`/hr/actions?dimension=${dim.id}`}>
                          <span className="relative z-10">İyileştir</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-border">
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Henüz veri yok. Çalışanları ankete davet edin!</p>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
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
              {/* Çalışan Ekle butonu yorum satırına alındı - erişim kapatıldı */}
              {/* <Button asChild className="w-full">
                <Link href="/hr/invite">
                  Davet Gönder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button> */}
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

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-600" />
                Wellbeing Day
              </CardTitle>
              <CardDescription>
                Şirket geneli iyi oluş günü
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                <Link href="/hr/wellbeing-day">
                  Etkinliklere Git
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Planlarım
              </CardTitle>
              <CardDescription>
                Etkinlik planlarınız
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/hr/plans">
                  Planlara Git
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

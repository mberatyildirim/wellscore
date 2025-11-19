// HR Reports Page - Departman ve Kurum Raporları
// View filtered reports by department or company-wide
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Download, BarChart3, Users, TrendingUp, Briefcase, Building2, FileText } from 'lucide-react';

export default async function ReportsPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get HR profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, companies(name, employee_count)")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "hr_admin") redirect("/auth/login");

  // Get all departments in the company
  const { data: departments } = await supabase
    .from("profiles")
    .select("department")
    .eq("company_id", profile.company_id)
    .not("department", "is", null);

  const uniqueDepartments = [...new Set(departments?.map(d => d.department).filter(Boolean))];

  // Get company-wide survey data
  const { data: allResponses } = await supabase
    .from("survey_responses")
    .select(`
      id,
      overall_score,
      completed_at,
      profiles!inner(company_id, department, full_name)
    `)
    .eq("profiles.company_id", profile.company_id);

  // Calculate company average
  const companyAverage = allResponses && allResponses.length > 0
    ? (allResponses.reduce((sum, r) => sum + (r.overall_score || 0), 0) / allResponses.length).toFixed(2)
    : "N/A";

  // Get dimension-level data for company
  const { data: dimensionData } = await supabase
    .from("dimension_scores")
    .select(`
      score,
      wellbeing_dimensions(name, name_tr),
      survey_responses!inner(
        id,
        profiles!inner(company_id, department)
      )
    `)
    .eq("survey_responses.profiles.company_id", profile.company_id);

  // Calculate department averages
  const departmentStats = uniqueDepartments.map(dept => {
    const deptResponses = allResponses?.filter((r: any) => r.profiles.department === dept) || [];
    const deptAverage = deptResponses.length > 0
      ? (deptResponses.reduce((sum, r) => sum + (r.overall_score || 0), 0) / deptResponses.length).toFixed(2)
      : "N/A";
    
    return {
      name: dept,
      participantCount: deptResponses.length,
      averageScore: deptAverage,
    };
  });

  // Calculate participation rate
  const totalEmployees = profile.companies?.employee_count || 0;
  const participationRate = totalEmployees > 0
    ? ((allResponses?.length || 0) / totalEmployees * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/hr/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                Raporlar
              </h1>
              <p className="mt-2 text-muted-foreground">
                Departman ve kurum geneli wellbeing analizleri
              </p>
            </div>
          </div>
        </div>

        {/* Company Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Toplam Katılımcı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{allResponses?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Kurum Ortalaması
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{companyAverage}</div>
              <p className="text-xs text-muted-foreground mt-1">/ 5.0</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Departman Sayısı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{uniqueDepartments.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Katılım Oranı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{participationRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Company-wide vs Department */}
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Kurum Geneli
            </TabsTrigger>
            <TabsTrigger value="department" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Departman Bazlı
            </TabsTrigger>
          </TabsList>

          {/* Company-wide Report */}
          <TabsContent value="company" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Kurum Geneli Wellbeing Raporu</CardTitle>
                <CardDescription>
                  {profile.companies?.name} - Tüm çalışanların wellbeing durumu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Yanıt</p>
                    <p className="text-2xl font-bold">{allResponses?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ortalama Skor</p>
                    <p className="text-2xl font-bold text-green-600">{companyAverage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Katılım</p>
                    <p className="text-2xl font-bold text-blue-600">{participationRate}%</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Hızlı İndirmeler</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Excel Raporu (.xlsx)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <FileText className="mr-2 h-4 w-4" />
                      PDF Raporu (.pdf)
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * Rapor indirme özelliği yakında aktif olacak
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Department-based Report */}
          <TabsContent value="department" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Departman Bazlı Wellbeing Analizi</CardTitle>
                <CardDescription>
                  Departmanlar arasında karşılaştırmalı analiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uniqueDepartments.length > 0 ? (
                  <div className="space-y-4">
                    {departmentStats
                      .sort((a, b) => parseFloat(b.averageScore as string) - parseFloat(a.averageScore as string))
                      .map((dept) => (
                        <div 
                          key={dept.name}
                          className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{dept.name}</h4>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{dept.participantCount} katılımcı</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Ortalama Skor</p>
                                <p className="text-2xl font-bold text-primary">{dept.averageScore}</p>
                              </div>
                              <Button variant="outline" size="sm" disabled>
                                <Download className="mr-2 h-3 w-3" />
                                İndir
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Henüz departman bilgisi yok</p>
                    <p className="text-sm mt-2">Çalışanlar davet edilirken departman bilgisi eklenmelidir</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


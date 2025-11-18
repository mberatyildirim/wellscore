// HR Employees Management Page
// View and manage all employees in the company
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft, UserPlus, Mail, CheckCircle, XCircle, Calendar } from 'lucide-react';

export default async function EmployeesPage() {
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

  // Get all employees in company
  const { data: employees } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_active, created_at, role")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  // Get survey completion status for each employee
  const employeeIds = employees?.map(e => e.id) || [];
  const { data: responses } = await supabase
    .from("survey_responses")
    .select("user_id, completed_at, overall_score")
    .in("user_id", employeeIds)
    .order("completed_at", { ascending: false });

  // Create a map of user_id to latest response
  const responseMap = new Map();
  responses?.forEach(response => {
    if (!responseMap.has(response.user_id)) {
      responseMap.set(response.user_id, response);
    }
  });

  // Enhance employees with survey data
  const employeesWithSurvey = employees?.map(employee => ({
    ...employee,
    latestResponse: responseMap.get(employee.id),
    hasCompletedSurvey: responseMap.has(employee.id),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
              <Link href="/hr/dashboard">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">Çalışanlar</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {profile.companies?.name} • {employees?.length || 0} çalışan
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/hr/invite">
              <UserPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Yeni Çalışan Ekle</span>
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Çalışan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{employees?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {employees?.filter(e => e.is_active).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Anket Tamamlanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {employeesWithSurvey?.filter(e => e.hasCompletedSurvey).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Katılım Oranı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {employees && employees.length > 0 
                  ? Math.round((employeesWithSurvey?.filter(e => e.hasCompletedSurvey).length || 0) / employees.length * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Tüm Çalışanlar</CardTitle>
            <CardDescription>
              Çalışanlarınızın listesi ve anket durumları
            </CardDescription>
          </CardHeader>
          <CardContent>
            {employeesWithSurvey && employeesWithSurvey.length > 0 ? (
              <div className="space-y-4">
                {employeesWithSurvey.map((employee) => (
                  <div 
                    key={employee.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    {/* Left Section - Avatar & Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm sm:text-base truncate">{employee.full_name}</span>
                          {employee.role === 'hr_admin' && (
                            <Badge variant="outline" className="text-xs">HR Admin</Badge>
                          )}
                          {employee.is_active ? (
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Status & Date */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                      {employee.hasCompletedSurvey ? (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xl sm:text-2xl font-bold text-primary">
                              {employee.latestResponse?.overall_score?.toFixed(1) || 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">WellScore</div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600 text-xs whitespace-nowrap">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Tamamlandı
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs whitespace-nowrap">
                          Anket Bekleniyor
                        </Badge>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(employee.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Henüz çalışan eklenmemiş</p>
                <p className="text-sm mb-4">Hemen çalışan eklemeye başlayın!</p>
                <Button asChild>
                  <Link href="/hr/invite">
                    <UserPlus className="mr-2 h-4 w-4" />
                    İlk Çalışanı Ekle
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/hr/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Çalışanlar</h1>
              <p className="text-muted-foreground">
                {profile.companies?.name} • {employees?.length || 0} çalışan
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/hr/invite">
              <UserPlus className="mr-2 h-4 w-4" />
              Yeni Çalışan Ekle
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
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
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{employee.full_name}</span>
                          {employee.role === 'hr_admin' && (
                            <Badge variant="outline" className="text-xs">HR Admin</Badge>
                          )}
                          {employee.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{employee.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {employee.hasCompletedSurvey ? (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {employee.latestResponse?.overall_score?.toFixed(1) || 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">WellScore</div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Tamamlandı
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Anket Bekleniyor
                        </Badge>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
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


// HR Plans Page - Planlarım
// HR admins can add events to their plans and request quotes
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Trash2, FileText, Users, DollarSign } from 'lucide-react';

export default async function PlansPage() {
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

  // Get all event plans for this company
  const { data: plans } = await supabase
    .from("event_plans")
    .select(`
      *,
      events(id, title, description, event_type, location),
      profiles!event_plans_hr_id_fkey(full_name)
    `)
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  // Group plans by status
  const draftPlans = plans?.filter(p => p.status === 'draft') || [];
  const quoteRequestedPlans = plans?.filter(p => p.status === 'quote_requested') || [];
  const approvedPlans = plans?.filter(p => p.status === 'approved') || [];
  const completedPlans = plans?.filter(p => p.status === 'completed') || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-gray-600">Taslak</Badge>;
      case 'quote_requested':
        return <Badge variant="outline" className="text-orange-600 border-orange-400">Teklif Bekleniyor</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-400">Onaylandı</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-blue-600 border-blue-400">Tamamlandı</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600">İptal Edildi</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/hr/dashboard">
                <ArrowLeft className="h-5 w-5 text-gray-900" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                Planlarım
              </h1>
              <p className="mt-2 text-muted-foreground">
                Etkinlik planlarınızı yönetin ve teklif alın
              </p>
            </div>
          </div>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/hr/actions">
              Etkinlik Ekle
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taslak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{draftPlans.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Teklif Bekleniyor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{quoteRequestedPlans.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Onaylandı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedPlans.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tamamlandı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{completedPlans.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Plans List */}
        {plans && plans.length > 0 ? (
          <div className="space-y-6">
            {/* Teklif Bekleniyor */}
            {quoteRequestedPlans.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Mail className="h-5 w-5 text-orange-600" />
                  Teklif Bekleniyor ({quoteRequestedPlans.length})
                </h2>
                <div className="grid gap-4">
                  {quoteRequestedPlans.map((plan: any) => (
                    <Card key={plan.id} className="border-orange-200 bg-orange-50">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <Calendar className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-lg">{plan.events?.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {plan.events?.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {getStatusBadge(plan.status)}
                                  <Badge variant="outline">{plan.events?.event_type}</Badge>
                                  {plan.planned_date && (
                                    <Badge variant="outline">
                                      {new Date(plan.planned_date).toLocaleDateString('tr-TR')}
                                    </Badge>
                                  )}
                                  {plan.estimated_participants && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {plan.estimated_participants} kişi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 sm:flex-none"
                              asChild
                            >
                              <a href={`mailto:info@wellscore.co?subject=Teklif Takibi: ${plan.events?.title}&body=Plan ID: ${plan.id}`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Takip Et
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Taslak */}
            {draftPlans.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Taslaklar ({draftPlans.length})
                </h2>
                <div className="grid gap-4">
                  {draftPlans.map((plan: any) => (
                    <Card key={plan.id} className="border-border">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-lg">{plan.events?.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {plan.events?.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {getStatusBadge(plan.status)}
                                  <Badge variant="outline">{plan.events?.event_type}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            <Button 
                              variant="default"
                              size="sm"
                              className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700"
                              asChild
                            >
                              <a href={`mailto:info@wellscore.co?subject=Teklif Talebi: ${plan.events?.title}&body=Plan ID: ${plan.id}%0D%0A%0D%0ATahmini Katılımcı: ${plan.estimated_participants || 'Belirtilmedi'}%0D%0APlanlanan Tarih: ${plan.planned_date ? new Date(plan.planned_date).toLocaleDateString('tr-TR') : 'Belirtilmedi'}`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Teklif Al
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onaylandı & Tamamlandı */}
            {(approvedPlans.length > 0 || completedPlans.length > 0) && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-900">Geçmiş Planlar</h2>
                <div className="grid gap-4">
                  {[...approvedPlans, ...completedPlans].map((plan: any) => (
                    <Card key={plan.id} className="border-border">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{plan.events?.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {getStatusBadge(plan.status)}
                              <Badge variant="outline">{plan.events?.event_type}</Badge>
                              {plan.planned_date && (
                                <Badge variant="outline">
                                  {new Date(plan.planned_date).toLocaleDateString('tr-TR')}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Henüz plan oluşturmadınız</p>
                <p className="text-sm mt-2">Etkinlikler sayfasından plana etkinlik ekleyebilirsiniz</p>
                <Button asChild className="mt-4 bg-orange-600 hover:bg-orange-700">
                  <Link href="/hr/actions">
                    Etkinliklere Git
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


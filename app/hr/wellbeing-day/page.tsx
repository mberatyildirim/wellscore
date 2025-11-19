// HR Wellbeing Day Page
// Organize and manage company wellbeing day events
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Heart, Sparkles, Plus } from 'lucide-react';

export default async function WellbeingDayPage() {
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

  // Get all wellbeing days for this company
  const { data: wellbeingDays } = await supabase
    .from("wellbeing_days")
    .select("*")
    .eq("company_id", profile.company_id)
    .order("event_date", { ascending: true });

  // Group by status
  const upcomingDays = wellbeingDays?.filter(d => 
    d.status === 'planning' || d.status === 'confirmed'
  ) || [];
  const completedDays = wellbeingDays?.filter(d => d.status === 'completed') || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <Badge variant="outline" className="text-orange-600 border-orange-400">Planlanıyor</Badge>;
      case 'confirmed':
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 sm:p-6">
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
                <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
                Wellbeing Day
              </h1>
              <p className="mt-2 text-muted-foreground">
                Şirket genelinde iyi oluş günleri organize edin
              </p>
            </div>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" asChild>
            <a href="mailto:info@wellscore.co?subject=Wellbeing Day Talebi&body=Merhaba,%0D%0A%0D%0AŞirketimiz için Wellbeing Day organizasyonu talep etmek istiyorum.%0D%0A%0D%0AŞirket:%0D%0ATarih Tercihi:%0D%0ATahmini Katılımcı:%0D%0AÖzel Notlar:%0D%0A%0D%0ATeşekkürler.">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Wellbeing Day
            </a>
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              Wellbeing Day Nedir?
            </CardTitle>
            <CardDescription>
              Çalışanlarınızın iyi oluşunu desteklemek için özel bir gün organize edin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Özel Tarih</p>
                  <p className="text-xs text-muted-foreground">Şirketiniz için özel bir gün belirleyin</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Toplu Aktiviteler</p>
                  <p className="text-xs text-muted-foreground">Yoga, meditasyon, seminer ve daha fazlası</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Ekip Ruhu</p>
                  <p className="text-xs text-muted-foreground">Çalışan bağlılığını artırın</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Yaklaşan Etkinlikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {upcomingDays.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tamamlanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {completedDays.length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Etkinlik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {wellbeingDays?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Wellbeing Days */}
        {upcomingDays.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Yaklaşan Wellbeing Day Etkinlikleri
            </h2>
            <div className="grid gap-4">
              {upcomingDays.map((day: any) => (
                <Card key={day.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                            <Heart className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{day.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {day.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                              {getStatusBadge(day.status)}
                              
                              {day.event_date && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(day.event_date).toLocaleDateString('tr-TR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </Badge>
                              )}
                              
                              {day.location && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {day.location}
                                </Badge>
                              )}
                              
                              {day.participant_count && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {day.participant_count} kişi
                                </Badge>
                              )}

                              {day.budget && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {day.budget.toLocaleString('tr-TR')} ₺
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          asChild
                        >
                          <a href={`mailto:info@wellscore.co?subject=Wellbeing Day Talep: ${day.title}&body=Merhaba,%0D%0A%0D%0A"${day.title}" etkinliği için teklif talep etmek istiyorum.%0D%0A%0D%0ATarih: ${day.event_date ? new Date(day.event_date).toLocaleDateString('tr-TR') : 'Belirtilmedi'}%0D%0AKonum: ${day.location || 'Belirtilmedi'}%0D%0ATahmini Katılımcı: ${day.participant_count || 'Belirtilmedi'}%0D%0A%0D%0ADetaylı bilgi ve fiyat teklifi rica ediyorum.%0D%0A%0D%0ATeşekkürler.`}>
                            Talep Et
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

        {/* Completed Wellbeing Days */}
        {completedDays.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
              Geçmiş Etkinlikler
            </h2>
            <div className="grid gap-3">
              {completedDays.map((day: any) => (
                <Card key={day.id} className="border-border opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-semibold">{day.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(day.event_date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(day.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!wellbeingDays || wellbeingDays.length === 0) && (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-50 text-orange-600" />
                <p className="text-lg font-medium">Henüz Wellbeing Day planlanmadı</p>
                <p className="text-sm mt-2 mb-4">
                  Çalışanlarınız için özel bir iyi oluş günü organize edin
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700" asChild>
                  <a href="mailto:info@wellscore.co?subject=Wellbeing Day Talebi&body=Merhaba,%0D%0A%0D%0AŞirketimiz için Wellbeing Day organizasyonu talep etmek istiyorum.%0D%0A%0D%0AŞirket:%0D%0ATarih Tercihi:%0D%0ATahmini Katılımcı:%0D%0AÖzel Notlar:%0D%0A%0D%0ATeşekkürler.">
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Wellbeing Day'i Oluştur
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


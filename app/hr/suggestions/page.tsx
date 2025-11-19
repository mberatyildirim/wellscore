// HR Employee Suggestions Page
// View and manage employee suggestions
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Lightbulb, MessageSquare, CheckCircle, XCircle, Clock, Sparkles, User } from 'lucide-react';

export default async function EmployeeSuggestionsPage() {
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

  // Get all employee suggestions for this company
  const { data: suggestions } = await supabase
    .from("employee_suggestions")
    .select(`
      *,
      profiles!employee_suggestions_employee_id_fkey(full_name, email, department)
    `)
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false });

  // Group by status
  const pendingSuggestions = suggestions?.filter(s => s.status === 'pending') || [];
  const reviewingSuggestions = suggestions?.filter(s => s.status === 'reviewing') || [];
  const approvedSuggestions = suggestions?.filter(s => s.status === 'approved') || [];
  const implementedSuggestions = suggestions?.filter(s => s.status === 'implemented') || [];
  const rejectedSuggestions = suggestions?.filter(s => s.status === 'rejected') || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-400">
            <Clock className="mr-1 h-3 w-3" />
            Beklemede
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-400">
            <MessageSquare className="mr-1 h-3 w-3" />
            İnceleniyor
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Onaylandı
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Reddedildi
          </Badge>
        );
      case 'implemented':
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-400">
            <Sparkles className="mr-1 h-3 w-3" />
            Uygulandı
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSuggestionTypeLabel = (type: string) => {
    switch (type) {
      case 'content':
        return 'İçerik';
      case 'event':
        return 'Etkinlik';
      case 'program':
        return 'Program';
      case 'other':
        return 'Diğer';
      default:
        return type;
    }
  };

  const renderSuggestionCard = (suggestion: any) => (
    <Card key={suggestion.id} className="border-border hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  {suggestion.description}
                </p>

                {/* Employee Info */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {suggestion.profiles?.full_name}
                  </div>
                  {suggestion.profiles?.department && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.profiles.department}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {getSuggestionTypeLabel(suggestion.suggestion_type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    {new Date(suggestion.created_at).toLocaleDateString('tr-TR')}
                  </Badge>
                </div>

                {/* HR Notes */}
                {suggestion.hr_notes && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-1">HR Notu:</p>
                    <p className="text-sm text-blue-800">{suggestion.hr_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Status */}
          <div className="flex lg:flex-col items-start lg:items-end gap-2">
            {getStatusBadge(suggestion.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
                Çalışan Önerileri
              </h1>
              <p className="mt-2 text-muted-foreground">
                Çalışanlarınızın gönderdiği içerik ve etkinlik önerilerini inceleyin
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Beklemede
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingSuggestions.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                İnceleniyor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{reviewingSuggestions.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Onaylandı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedSuggestions.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uygulandı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{implementedSuggestions.length}</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{suggestions?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions List */}
        {suggestions && suggestions.length > 0 ? (
          <div className="space-y-8">
            {/* Pending */}
            {pendingSuggestions.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Bekleyen Öneriler ({pendingSuggestions.length})
                </h2>
                <div className="grid gap-4">
                  {pendingSuggestions.map(renderSuggestionCard)}
                </div>
              </div>
            )}

            {/* Reviewing */}
            {reviewingSuggestions.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  İncelenen Öneriler ({reviewingSuggestions.length})
                </h2>
                <div className="grid gap-4">
                  {reviewingSuggestions.map(renderSuggestionCard)}
                </div>
              </div>
            )}

            {/* Approved & Implemented */}
            {(approvedSuggestions.length > 0 || implementedSuggestions.length > 0) && (
              <div>
                <h2 className="text-xl font-bold mb-4">Kabul Edilen Öneriler</h2>
                <div className="grid gap-4">
                  {[...approvedSuggestions, ...implementedSuggestions].map(renderSuggestionCard)}
                </div>
              </div>
            )}

            {/* Rejected */}
            {rejectedSuggestions.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-muted-foreground">Reddedilen Öneriler</h2>
                <div className="grid gap-4 opacity-75">
                  {rejectedSuggestions.map(renderSuggestionCard)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50 text-orange-600" />
                <p className="text-lg font-medium">Henüz öneri yok</p>
                <p className="text-sm mt-2">
                  Çalışanlarınız henüz öneri göndermemiş
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


'use client';

// Employee Personal Recommendations & Suggestions
// View personalized recommendations and submit suggestions to HR
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Send, CheckCircle, Clock, XCircle, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { LoadingScreen } from "@/components/ui/loading-screen";
import { toast } from "sonner";

export default function RecommendationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [mySuggestions, setMySuggestions] = useState<any[]>([]);
  
  // New suggestion form
  const [suggestionType, setSuggestionType] = useState('content');
  const [suggestionTitle, setSuggestionTitle] = useState('');
  const [suggestionDescription, setSuggestionDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();

    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    // Get recommendations (from recommendations table)
    const { data: recs } = await supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (recs) setRecommendations(recs);

    // Get my suggestions
    const { data: suggestions } = await supabase
      .from("employee_suggestions")
      .select("*")
      .eq("employee_id", user.id)
      .order("created_at", { ascending: false });
    
    if (suggestions) setMySuggestions(suggestions);

    setIsLoading(false);
  };

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!suggestionTitle.trim() || !suggestionDescription.trim()) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı');

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error('Profil bulunamadı');

      // Insert suggestion
      const { error } = await supabase
        .from("employee_suggestions")
        .insert({
          employee_id: user.id,
          company_id: profile.company_id,
          suggestion_type: suggestionType,
          title: suggestionTitle,
          description: suggestionDescription,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Öneriniz başarıyla gönderildi! 🎉');
      
      // Reset form
      setSuggestionTitle('');
      setSuggestionDescription('');
      setSuggestionType('content');

      // Refresh suggestions
      fetchData();

    } catch (error: any) {
      console.error('[Submit Suggestion Error]:', error);
      toast.error(error.message || 'Öneri gönderilirken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            İnceleniyor
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-400 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Değerlendiriliyor
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-400 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Onaylandı
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-400 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Reddedildi
          </Badge>
        );
      case 'implemented':
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
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

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employee/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
              <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600" />
              Kişisel Öneriler
            </h1>
            <p className="mt-2 text-muted-foreground">
              Size özel öneriler ve taleplerini yönetin
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Size Özel Öneriler
            </TabsTrigger>
            <TabsTrigger value="my-suggestions" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Önerilerim ({mySuggestions.length})
            </TabsTrigger>
          </TabsList>

          {/* Personalized Recommendations */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  Sizin İçin Seçtiklerimiz
                </CardTitle>
                <CardDescription>
                  Anket sonuçlarınıza göre özel olarak hazırlanmış öneriler
                </CardDescription>
              </CardHeader>
            </Card>

            {recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="border-border">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                          <Heart className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{rec.title || 'Öneri'}</h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            {rec.description || rec.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50 text-orange-600" />
                    <p className="text-lg font-medium">Henüz öneri yok</p>
                    <p className="text-sm mt-2">
                      Anketi tamamladıktan sonra size özel öneriler göreceksiniz
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Suggestions */}
          <TabsContent value="my-suggestions" className="space-y-6">
            {/* Submit New Suggestion Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Yeni Öneri Gönder
                </CardTitle>
                <CardDescription>
                  İyi oluşunuz için fikirlerinizi HR ekibimizle paylaşın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Öneri Tipi</Label>
                    <Select value={suggestionType} onValueChange={setSuggestionType} disabled={isSubmitting}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">İçerik Önerisi</SelectItem>
                        <SelectItem value="event">Etkinlik Önerisi</SelectItem>
                        <SelectItem value="program">Program Önerisi</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık *</Label>
                    <Input
                      id="title"
                      placeholder="Örn: Yoga dersleri"
                      value={suggestionTitle}
                      onChange={(e) => setSuggestionTitle(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama *</Label>
                    <Textarea
                      id="description"
                      placeholder="Önerinizi detaylı bir şekilde açıklayın..."
                      rows={4}
                      value={suggestionDescription}
                      onChange={(e) => setSuggestionDescription(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Gönderiliyor...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Öneriyi Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Suggestions List */}
            {mySuggestions.length > 0 ? (
              <div className="grid gap-4">
                {mySuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="border-border">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{suggestion.title}</h4>
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {suggestion.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {getStatusBadge(suggestion.status)}
                                <Badge variant="outline" className="text-xs">
                                  {getSuggestionTypeLabel(suggestion.suggestion_type)}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  {new Date(suggestion.created_at).toLocaleDateString('tr-TR')}
                                </Badge>
                              </div>
                              {suggestion.hr_notes && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">HR Notu:</p>
                                  <p className="text-sm text-blue-800">{suggestion.hr_notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Send className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Henüz öneri göndermediniz</p>
                    <p className="text-sm mt-2">
                      İyi oluşunuz için fikirlerinizi yukarıdaki form ile paylaşın
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


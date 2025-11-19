'use client';

// Employee Content Library
// Browse and interact with wellbeing content
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, BookOpen, Video, Headphones, FileText, Clock, Bookmark, Heart, ExternalLink, Play } from 'lucide-react';
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function ContentLibraryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<string>('all');

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

    // Get wellbeing dimensions
    const { data: dims } = await supabase
      .from("wellbeing_dimensions")
      .select("*")
      .order("order_index");
    
    if (dims) setDimensions(dims);

    // Get content library
    const { data: contentData } = await supabase
      .from("content_library")
      .select("*, wellbeing_dimensions(name_tr)")
      .order("created_at", { ascending: false });
    
    if (contentData) setContent(contentData);

    setIsLoading(false);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'podcast':
        return <Headphones className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'podcast':
        return 'Podcast';
      case 'article':
        return 'Makale';
      case 'guide':
        return 'Rehber';
      case 'tool':
        return 'Araç';
      case 'exercise':
        return 'Egzersiz';
      default:
        return type;
    }
  };

  const filteredContent = selectedDimension === 'all'
    ? content
    : content.filter(c => c.dimension_id === selectedDimension);

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
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              İçerik Kütüphanesi
            </h1>
            <p className="mt-2 text-muted-foreground">
              İyi oluşunuz için özenle seçilmiş içerikler
            </p>
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedDimension === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDimension('all')}
            className={selectedDimension === 'all' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            Tümü ({content.length})
          </Button>
          {dimensions.map((dim) => (
            <Button
              key={dim.id}
              variant={selectedDimension === dim.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDimension(dim.id)}
              className={selectedDimension === dim.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              {dim.name_tr}
            </Button>
          ))}
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredContent.map((item) => (
              <Card key={item.id} className="border-border hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                        {getContentTypeIcon(item.content_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg line-clamp-2">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {getContentTypeLabel(item.content_type)}
                    </Badge>
                    {item.wellbeing_dimensions && (
                      <Badge variant="outline" className="text-xs border-orange-400 text-orange-700">
                        {item.wellbeing_dimensions.name_tr}
                      </Badge>
                    )}
                    {item.duration_minutes && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration_minutes} dk
                      </Badge>
                    )}
                    {item.is_premium && (
                      <Badge variant="outline" className="text-xs bg-orange-50 border-orange-400 text-orange-700">
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                    {item.description}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    {item.content_url ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        asChild
                      >
                        <a href={item.content_url} target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-3 w-3" />
                          İzle/Oku
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled
                      >
                        Yakında
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Henüz içerik yok</p>
                <p className="text-sm mt-2">
                  {selectedDimension === 'all'
                    ? 'Kütüphanede henüz içerik eklenmemiş'
                    : 'Bu kategori için henüz içerik yok'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

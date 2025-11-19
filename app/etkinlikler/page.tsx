// Public Events Page - Anyone can view wellbeing events
// Each event has a "Request" button that opens email
'use client';

import { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import Image from "next/image";
import { Calendar, MapPin, Mail, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicEventsPage() {
  // State to store events and dimensions
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Fetch events and dimensions on mount
  useEffect(() => {
    async function loadEvents() {
      const supabase = createClient();

      // Fetch all dimensions for filtering
      const { data: dimensionsData } = await supabase
        .from("wellbeing_dimensions")
        .select("id, name_tr")
        .order("order_index", { ascending: true });

      setDimensions(dimensionsData || []);

      // Fetch all events (public, no auth required)
      const { data: eventsData } = await supabase
        .from("events")
        .select(`
          *,
          wellbeing_dimensions(id, name_tr, color)
        `)
        .order("created_at", { ascending: false });

      setEvents(eventsData || []);
      setLoading(false);
    }

    loadEvents();
  }, []);

  // Filter events based on selected dimension
  const getFilteredEvents = () => {
    if (selectedFilter === 'all') return events;
    if (selectedFilter === 'special') {
      // Special events (Fitty) - dimension_id is null
      return events.filter((e: any) => e.dimension_id === null);
    }
    // Filter by dimension
    return events.filter((e: any) => e.dimension_id === selectedFilter);
  };

  const filteredEvents = getFilteredEvents();
  const specialEvents = filteredEvents?.filter((e: any) => e.dimension_id === null) || [];
  const regularEvents = filteredEvents?.filter((e: any) => e.dimension_id !== null) || [];

  // Build filter options: All + Dimensions
  const filterOptions = [
    { value: 'all', label: 'Tümü' },
    ...dimensions.map(d => ({ value: d.id, label: d.name_tr })),
    { value: 'special', label: 'Kapsamlı Çözümler' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Etkinlikler yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Button variant="ghost" asChild className="mb-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ana Sayfaya Dön
                </Link>
              </Button>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Çalışan İyi Oluşu <span className="text-orange-600">Etkinlikleri</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                8 farklı iyi oluş boyutunda uzman iş ortaklarımızla özenle seçilmiş etkinlikler
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      selectedFilter === option.value
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Special Events - Fitty */}
            {specialEvents.length > 0 && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-orange-600" />
                    Özel İş Ortağımız
                  </h2>
                  <p className="mt-3 text-gray-600 text-lg">
                    Tüm çalışanlarınız için özel olarak hazırlanmış esnek spor ve wellness çözümü
                  </p>
                </div>
                
                {specialEvents.map((event: any) => (
                  <Card 
                    key={event.id} 
                    className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 via-white to-orange-50 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Special Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold shadow-lg">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Özel Hizmet
                      </Badge>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
                      {/* Logo */}
                      <div className="flex-shrink-0 flex items-center justify-center lg:justify-start">
                        <div className="relative w-48 h-20">
                          <Image 
                            src="/fitty-logo.png" 
                            alt="Fitty" 
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-orange-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-orange-400 text-orange-800 bg-orange-50 font-semibold">
                            🌟 {event.event_type}
                          </Badge>
                          <Badge variant="outline" className="border-orange-300 text-orange-700">
                            📍 {event.location}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 flex items-center lg:w-64">
                        <Button 
                          variant="default" 
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                          size="lg"
                          asChild
                        >
                          <a href={`mailto:info@wellscore.co?subject=Fitty Etkinlik Talebi&body=Merhaba,%0D%0A%0D%0AFitty etkinliği hakkında bilgi almak istiyorum.%0D%0A%0D%0AŞirket:%0D%0ATahmini Katılımcı:%0D%0AÖzel Notlar:%0D%0A%0D%0ATeşekkürler.`}>
                            <Mail className="mr-2 h-5 w-5" />
                            Talep Et
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Regular Events Grid */}
            {regularEvents.length > 0 ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Diğer Etkinlikler
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Wellbeing boyutlarına göre özelleştirilmiş etkinlikler
                  </p>
                </div>
                
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {regularEvents.map((event: any) => {
                    const dimensionColor = event.wellbeing_dimensions?.color || "#6366f1";

                    return (
                      <Card key={event.id} className="border-border hover:shadow-lg transition-shadow flex flex-col">
                        <CardHeader className="pb-3">
                          {/* Dimension Badge */}
                          <div className="mb-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: dimensionColor,
                                color: dimensionColor 
                              }}
                            >
                              {event.wellbeing_dimensions?.name_tr}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {event.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex flex-col flex-1 justify-between space-y-4">
                          {/* Event Details */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              <span>{event.event_type}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-orange-600" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Request Button */}
                          <Button 
                            variant="default" 
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            asChild
                          >
                            <a href={`mailto:info@wellscore.co?subject=${encodeURIComponent(event.title)} Etkinlik Talebi&body=Merhaba,%0D%0A%0D%0A${encodeURIComponent(event.title)} etkinliği hakkında bilgi almak istiyorum.%0D%0A%0D%0AŞirket:%0D%0ATahmini Katılımcı:%0D%0AÖzel Notlar:%0D%0A%0D%0ATeşekkürler.`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Talep Et
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Bu kategoride etkinlik bulunamadı.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


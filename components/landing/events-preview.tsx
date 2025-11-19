// Events Preview Section for Landing Page
// Shows a preview of wellbeing events with a CTA to view all
'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowRight, Sparkles, MapPin } from "lucide-react";

export function EventsPreview() {
  // State for events
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events on component mount
  useEffect(() => {
    async function loadEvents() {
      const supabase = createClient();

      // Fetch first 6 events for preview
      const { data: eventsData } = await supabase
        .from("events")
        .select(`
          *,
          wellbeing_dimensions(id, name_tr, color)
        `)
        .order("created_at", { ascending: false })
        .limit(6);

      setEvents(eventsData || []);
      setLoading(false);
    }

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            Etkinliklerimiz
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Çalışan İyi Oluşu için <span className="text-orange-600">Özel Etkinlikler</span>
          </h2>
          <p className="text-lg text-gray-600">
            8 farklı iyi oluş boyutunda uzman iş ortaklarımızla çalışan memnuniyetini artırın
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {events.map((event: any) => {
            const dimensionColor = event.wellbeing_dimensions?.color || "#f97316";
            const isSpecial = event.dimension_id === null;

            return (
              <Card 
                key={event.id} 
                className={`border-border hover:shadow-xl transition-all duration-300 flex flex-col ${
                  isSpecial ? 'border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  {/* Badge */}
                  <div className="mb-2">
                    {isSpecial ? (
                      <Badge className="bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Özel Hizmet
                      </Badge>
                    ) : (
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
                    )}
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-1 justify-end">
                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span>{event.event_type}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-orange-600" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            asChild
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <Link href="/etkinlikler">
              Tüm Etkinlikleri Görüntüle
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            115+ etkinlik · 8 iyi oluş boyutu · Uzman iş ortakları
          </p>
        </div>
      </div>
    </section>
  );
}


"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  provider_name: string;
  service_name: string;
  description: string | null;
  price_range: string | null;
  duration: string | null;
  service_type: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  image_url: string | null;
  wellbeing_dimensions: { name_tr: string } | null;
}

export function MarketplaceGrid({
  services,
  companyId,
  userId,
}: {
  services: Service[];
  companyId: string;
  userId: string;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddToCart = async (serviceId: string) => {
    setLoadingId(serviceId);
    try {
      const response = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          companyId,
          userId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (services.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Bu kategoride hizmet bulunmuyor</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {services.map((service) => (
        <Card key={service.id} className="border-border bg-card">
          {service.image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src={service.image_url || "/placeholder.svg"}
                alt={service.service_name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-card-foreground">
                  {service.service_name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.provider_name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground">{service.description}</p>

            <div className="flex flex-wrap gap-2">
              {service.wellbeing_dimensions && (
                <Badge className="bg-accent text-accent-foreground">
                  {service.wellbeing_dimensions.name_tr}
                </Badge>
              )}
              {service.service_type && (
                <Badge variant="outline" className="border-border text-foreground">
                  {service.service_type}
                </Badge>
              )}
              {service.price_range && (
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  {service.price_range}
                </Badge>
              )}
              {service.duration && (
                <Badge variant="outline" className="border-border text-foreground">
                  {service.duration}
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              {service.contact_email && (
                <p>Email: {service.contact_email}</p>
              )}
              {service.contact_phone && (
                <p>Telefon: {service.contact_phone}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleAddToCart(service.id)}
                disabled={loadingId === service.id}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loadingId === service.id ? "Ekleniyor..." : "Sepete Ekle"}
              </Button>
              {service.website_url && (
                <Button
                  asChild
                  variant="outline"
                  className="border-border"
                >
                  <a href={service.website_url} target="_blank" rel="noopener noreferrer">
                    Detaylar
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface ServiceRequest {
  id: string;
  service_id: string;
  meeting_requested: boolean;
  marketplace_services: {
    service_name: string;
    provider_name: string;
    wellbeing_dimensions: { name_tr: string } | null;
  } | null;
}

export function ServiceCart({
  requests,
  companyId,
}: {
  requests: ServiceRequest[];
  companyId: string;
}) {
  const [isRequesting, setIsRequesting] = useState(false);
  const router = useRouter();

  const handleRequestMeeting = async () => {
    setIsRequesting(true);
    try {
      const response = await fetch("/api/request-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to request meeting:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRemoveItem = async (requestId: string) => {
    try {
      const response = await fetch("/api/remove-from-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <Card className="sticky top-6 border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Aksiyon Listesi</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sepetteki hizmetler
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Sepetiniz boş
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {request.marketplace_services?.service_name}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.marketplace_services?.provider_name}
                      </p>
                      {request.marketplace_services?.wellbeing_dimensions && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {request.marketplace_services.wellbeing_dimensions.name_tr}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(request.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleRequestMeeting}
              disabled={isRequesting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isRequesting ? "Gönderiliyor..." : "Toplantı Talebi Gönder"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Sepetteki hizmetler için toplantı talep edilecek
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

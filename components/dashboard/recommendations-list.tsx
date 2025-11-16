"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Recommendation {
  id: string;
  timeframe: "short_term" | "medium_term" | "long_term";
  recommendation_text: string;
  wellbeing_dimensions: {
    name_tr: string;
  } | null;
}

interface DimensionAverage {
  id: string;
  name: string;
  name_tr: string;
  average: number;
}

export function RecommendationsList({
  recommendations,
  dimensionAverages,
}: {
  recommendations: Recommendation[];
  dimensionAverages: DimensionAverage[];
}) {
  const shortTerm = recommendations.filter((r) => r.timeframe === "short_term");
  const mediumTerm = recommendations.filter((r) => r.timeframe === "medium_term");
  const longTerm = recommendations.filter((r) => r.timeframe === "long_term");

  // Find areas that need improvement (score < 3.5)
  const improvementAreas = dimensionAverages
    .filter((d) => d.average < 3.5)
    .sort((a, b) => a.average - b.average);

  const renderRecommendations = (items: Recommendation[], title: string, description: string) => (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((rec) => (
              <li key={rec.id} className="flex gap-3 rounded-lg border border-border bg-background p-4">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{rec.recommendation_text}</p>
                  {rec.wellbeing_dimensions && (
                    <span className="mt-2 inline-block rounded bg-accent px-2 py-1 text-xs text-accent-foreground">
                      {rec.wellbeing_dimensions.name_tr}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            AI öneri motoru yakında bu bölüme öneriler ekleyecek.
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {improvementAreas.length > 0 && (
        <Card className="border-border bg-accent">
          <CardHeader>
            <CardTitle className="text-card-foreground">Odaklanma Alanları</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gelişim için öncelikli alanlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {improvementAreas.map((area) => (
                <div
                  key={area.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <h4 className="font-medium text-foreground">{area.name_tr}</h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {area.average.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Bu alanda iyileşme için önerileri inceleyin
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="short" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="short">Kısa Vade</TabsTrigger>
          <TabsTrigger value="medium">Orta Vade</TabsTrigger>
          <TabsTrigger value="long">Uzun Vade</TabsTrigger>
        </TabsList>

        <TabsContent value="short">
          {renderRecommendations(
            shortTerm,
            "Kısa Vadeli Öneriler",
            "Hemen uygulayabileceğiniz aksiyonlar (1-2 hafta)"
          )}
        </TabsContent>

        <TabsContent value="medium">
          {renderRecommendations(
            mediumTerm,
            "Orta Vadeli Öneriler",
            "Gelişim için planlayabileceğiniz aksiyonlar (1-3 ay)"
          )}
        </TabsContent>

        <TabsContent value="long">
          {renderRecommendations(
            longTerm,
            "Uzun Vadeli Öneriler",
            "Sürdürülebilir değişim için hedefler (3+ ay)"
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

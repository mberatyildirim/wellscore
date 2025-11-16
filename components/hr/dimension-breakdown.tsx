"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DimensionAverage {
  id: string;
  name: string;
  name_tr: string;
  average: number;
}

export function DimensionBreakdown({
  dimensionAverages,
}: {
  dimensionAverages: DimensionAverage[];
}) {
  const sortedDimensions = [...dimensionAverages].sort((a, b) => a.average - b.average);
  const lowestScore = sortedDimensions[0];
  const highestScore = sortedDimensions[sortedDimensions.length - 1];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Boyut Bazlı Skorlar</CardTitle>
          <CardDescription className="text-muted-foreground">
            Organizasyonun 8 wellbeing boyutundaki performansı
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedDimensions.map((dimension) => (
              <div key={dimension.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{dimension.name_tr}</span>
                  <span className="text-muted-foreground">
                    {dimension.average.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="relative h-8 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(dimension.average / 5) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground">
                      {Math.round((dimension.average / 5) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-card-foreground">En Düşük Skor</CardTitle>
            <CardDescription className="text-muted-foreground">
              Öncelikli aksiyon alanı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-bold text-foreground">{lowestScore?.name_tr}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-destructive">
                {lowestScore?.average.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Bu alanda çalışanların desteğe ihtiyacı var. Hedefli wellbeing programları
              önerin.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-card-foreground">En Yüksek Skor</CardTitle>
            <CardDescription className="text-muted-foreground">
              Güçlü alan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-bold text-foreground">{highestScore?.name_tr}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {highestScore?.average.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Bu alanda organizasyon başarılı. Mevcut uygulamaları sürdürün.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

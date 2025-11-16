"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DimensionAverage {
  id: string;
  name: string;
  name_tr: string;
  average: number;
}

export function ScoreChart({ dimensionAverages }: { dimensionAverages: DimensionAverage[] }) {
  const maxScore = 5;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Boyut Bazlı Skorlar</CardTitle>
        <CardDescription className="text-muted-foreground">
          8 wellbeing boyutundaki performansınız
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dimensionAverages.map((dimension) => (
            <div key={dimension.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{dimension.name_tr}</span>
                <span className="text-muted-foreground">{dimension.average.toFixed(1)} / 5.0</span>
              </div>
              <div className="relative h-8 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(dimension.average / maxScore) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-foreground">
                    {Math.round((dimension.average / maxScore) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

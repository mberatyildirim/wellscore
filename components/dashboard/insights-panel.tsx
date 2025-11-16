"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DimensionAverage {
  id: string;
  name: string;
  name_tr: string;
  average: number;
}

export function InsightsPanel({ dimensionAverages }: { dimensionAverages: DimensionAverage[] }) {
  // Find strengths (score >= 4.0)
  const strengths = dimensionAverages
    .filter((d) => d.average >= 4.0)
    .sort((a, b) => b.average - a.average);

  // Find areas needing attention (score < 3.0)
  const needsAttention = dimensionAverages
    .filter((d) => d.average < 3.0)
    .sort((a, b) => a.average - b.average);

  const overallScore = dimensionAverages.reduce((sum, d) => sum + d.average, 0) / dimensionAverages.length;

  const getOverallMessage = () => {
    if (overallScore >= 4.0) {
      return "Wellbeing durumunuz oldukça iyi! Mevcut alışkanlıklarınızı sürdürmeye devam edin.";
    } else if (overallScore >= 3.0) {
      return "Wellbeing durumunuz orta seviyede. Bazı alanlarda iyileştirme fırsatları var.";
    } else {
      return "Wellbeing durumunuz dikkat gerektiriyor. Önerileri inceleyerek adım adım iyileşme sağlayabilirsiniz.";
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Kişisel İçgörüler</CardTitle>
        <CardDescription className="text-muted-foreground">
          Skorlarınıza dayalı analiz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border bg-accent p-4">
          <p className="text-sm text-accent-foreground">{getOverallMessage()}</p>
        </div>

        {strengths.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold text-foreground">Güçlü Yönleriniz</h4>
            <div className="space-y-2">
              {strengths.map((strength) => (
                <div
                  key={strength.id}
                  className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {strength.name_tr}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {strength.average.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Bu alanlarda gösterdiğiniz başarıyı korumaya devam edin!
            </p>
          </div>
        )}

        {needsAttention.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold text-foreground">İyileştirme Alanları</h4>
            <div className="space-y-2">
              {needsAttention.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {area.name_tr}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {area.average.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Bu alanlara odaklanarak wellbeing durumunuzu iyileştirebilirsiniz.
            </p>
          </div>
        )}

        {strengths.length === 0 && needsAttention.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Tüm boyutlarınız dengeli bir seviyede. Genel olarak iyi bir performans gösteriyorsunuz.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

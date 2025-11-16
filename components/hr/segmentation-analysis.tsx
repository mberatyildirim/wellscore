"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SegmentData {
  count: number;
  avgScore: number;
  scores: number[];
}

interface SegmentationAnalysisProps {
  segmentationData: {
    byDepartment: Record<string, SegmentData>;
    byCity: Record<string, SegmentData>;
    byAge: Record<string, SegmentData>;
    byGender: Record<string, SegmentData>;
  };
}

export function SegmentationAnalysis({ segmentationData }: SegmentationAnalysisProps) {
  const renderSegment = (
    data: Record<string, SegmentData>,
    title: string,
    description: string
  ) => {
    const sortedSegments = Object.entries(data)
      .filter(([_, values]) => values.count > 0)
      .sort(([, a], [, b]) => b.avgScore - a.avgScore);

    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSegments.length > 0 ? (
            <div className="space-y-4">
              {sortedSegments.map(([name, values]) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{name}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {values.count} katılımcı
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {values.avgScore.toFixed(1)}
                    </div>
                    <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(values.avgScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Veri bulunmuyor</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="department" className="space-y-4">
      <TabsList className="bg-muted">
        <TabsTrigger value="department">Departman</TabsTrigger>
        <TabsTrigger value="city">Şehir</TabsTrigger>
        <TabsTrigger value="age">Yaş</TabsTrigger>
        <TabsTrigger value="gender">Cinsiyet</TabsTrigger>
      </TabsList>

      <TabsContent value="department">
        {renderSegment(
          segmentationData.byDepartment,
          "Departman Bazlı Analiz",
          "Departmanlar arası wellbeing karşılaştırması"
        )}
      </TabsContent>

      <TabsContent value="city">
        {renderSegment(
          segmentationData.byCity,
          "Şehir Bazlı Analiz",
          "Lokasyon bazında wellbeing dağılımı"
        )}
      </TabsContent>

      <TabsContent value="age">
        {renderSegment(
          segmentationData.byAge,
          "Yaş Grubu Analizi",
          "Farklı yaş gruplarının wellbeing durumu"
        )}
      </TabsContent>

      <TabsContent value="gender">
        {renderSegment(
          segmentationData.byGender,
          "Cinsiyet Bazlı Analiz",
          "Cinsiyet grupları arası wellbeing karşılaştırması"
        )}
      </TabsContent>
    </Tabs>
  );
}

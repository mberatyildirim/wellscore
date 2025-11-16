"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendChartProps {
  responses: any[];
  answers: any[];
}

export function TrendChart({ responses, answers }: TrendChartProps) {
  // Group responses by month
  const monthlyData: Record<string, { count: number; totalScore: number }> = {};

  responses.forEach((response) => {
    const date = new Date(response.completed_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const responseAnswers = answers.filter((a) => a.response_id === response.id);
    const avgScore =
      responseAnswers.length > 0
        ? responseAnswers.reduce((sum, a) => sum + a.score, 0) / responseAnswers.length
        : 0;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { count: 0, totalScore: 0 };
    }

    monthlyData[monthKey].count++;
    monthlyData[monthKey].totalScore += avgScore;
  });

  const trendData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      avgScore: data.totalScore / data.count,
      count: data.count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Zaman İçinde Gelişim</CardTitle>
        <CardDescription className="text-muted-foreground">
          Aylık wellbeing skorları ve katılım
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trendData.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {trendData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {new Date(data.month + "-01").toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{data.count} katılımcı</span>
                      <span className="font-bold text-foreground">
                        {data.avgScore.toFixed(1)} / 5.0
                      </span>
                    </div>
                  </div>
                  <div className="h-8 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(data.avgScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Henüz trend analizi için yeterli veri yok. Daha fazla anket tamamlandığında
            burada zaman içindeki değişimi görebilirsiniz.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

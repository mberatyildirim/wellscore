"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardsProps {
  totalEmployees: number;
  activeRespondents: number;
  completionRate: number;
  averageScore: number;
}

export function KPICards({
  totalEmployees,
  activeRespondents,
  completionRate,
  averageScore,
}: KPICardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Toplam Çalışan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{totalEmployees}</div>
          <p className="mt-1 text-xs text-muted-foreground">Kayıtlı çalışan sayısı</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Katılımcı Sayısı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{activeRespondents}</div>
          <p className="mt-1 text-xs text-muted-foreground">Anket tamamlayan</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tamamlanma Oranı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{completionRate.toFixed(1)}%</div>
          <p className="mt-1 text-xs text-muted-foreground">Anket katılım oranı</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ortalama WellScore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {averageScore.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {averageScore >= 4.0
              ? "Mükemmel durum"
              : averageScore >= 3.0
              ? "İyi durum"
              : "İyileştirme gerekli"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

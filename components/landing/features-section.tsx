import { Activity, Brain, Heart, Shield, TrendingUp, Users, Zap, BarChart3 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Activity,
    title: "8 İyi Oluş Boyutu",
    description: "Fiziksel, Duygusal, Zihinsel, Sosyal, Amaç, Finansal, Çevresel ve Mesleki iyi oluş boyutlarında kapsamlı ölçüm.",
  },
  {
    icon: Brain,
    title: "AI Destekli İçgörüler",
    description: "Organizasyonunuzun benzersiz ihtiyaçlarını anlayan gelişmiş AI ile kişiselleştirilmiş öneriler alın.",
  },
  {
    icon: BarChart3,
    title: "Gelişmiş Analitik",
    description: "Departman, lokasyon, yaş, cinsiyet ve özel boyutlara göre derin segmentasyon ile gerçek zamanlı gösterge panelleri.",
  },
  {
    icon: Shield,
    title: "KVKK Uyumlu",
    description: "Kurumsal düzeyde güvenlik, tam GDPR/KVKK uyumluluğu ve yerleşik anonimleştirilmiş veri koruma.",
  },
  {
    icon: Users,
    title: "Çalışan Katılımı",
    description: "Katılımı artırmak için interaktif iyi oluş kütüphanesi, etkinlik takvimi ve kişiselleştirilmiş içerik atamaları.",
  },
  {
    icon: TrendingUp,
    title: "Kanıtlanmış ROI",
    description: "Trend analizi ile zaman içindeki gelişimi takip edin ve iyi oluş girişimlerinin iş etkisini gösterin.",
  },
  {
    icon: Heart,
    title: "Wellscore Pazaryeri",
    description: "Onaylanmış iyi oluş hizmet sağlayıcılarıyla bağlantı kurun ve programlarınızı güvenilir ortaklarla ölçeklendirin.",
  },
  {
    icon: Zap,
    title: "Hızlı Kurulum",
    description: "Aylar değil, günler içinde başlayın. İK ekipleri ve çalışanlar için anında değer sunan basit onboarding.",
  },
];

export function FeaturesSection() {
  return (
    <div className="w-full py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5">
            <span className="text-sm font-medium text-muted-foreground">Platform Özellikleri</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center max-w-3xl text-balance text-black">
            İşyeri iyi oluşunu dönüştürmek için ihtiyacınız olan her şey
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl text-balance">
            Veri odaklı iyi oluş stratejileriyle gerçek etki yaratmak isteyen modern İK ekipleri için tasarlanmış eksiksiz bir platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-orange-50 w-12 h-12 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-black">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

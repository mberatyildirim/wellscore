import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Anketinizi Yayınlayın",
    description: "40 soruluk wellscore değerlendirmesini dakikalar içinde organizasyonunuz genelinde başlatın. Bilimsel olarak doğrulanmış anketimiz, basit ve çekici bir arayüzle tüm 8 iyi oluş boyutunu kapsar.",
    highlights: ["5-10 dakika tamamlanma süresi", "Çoklu dil desteği", "Mobil uyumlu"],
  },
  {
    number: "02",
    title: "Sonuçları Analiz Edin",
    description: "Kapsamlı analitik gösterge panellerine anında erişin. Tam anonimlik ve KVKK uyumluluğunu korurken verileri departman, lokasyon, demografik ve daha fazlasına göre segmentlere ayırın.",
    highlights: ["Gerçek zamanlı içgörüler", "Trend analizi", "Özel segmentasyon"],
  },
  {
    number: "03",
    title: "Aksiyon Alın",
    description: "Organizasyonunuza özel AI destekli öneriler alın. Kişiselleştirilmiş içerik atayın, hedefli programlar oluşturun ve pazaryerimiz üzerinden iyi oluş hizmet sağlayıcılarıyla bağlantı kurun.",
    highlights: ["AI odaklı öneriler", "İçerik kütüphanesi", "Pazaryeri erişimi"],
  },
  {
    number: "04",
    title: "Etkiyi Ölçün",
    description: "Longitudinal çalışmalarla zaman içindeki gelişmeleri takip edin. Önce-sonra karşılaştırmalarıyla ROI gösterin ve paydaşlara iyi oluş girişimlerinizin somut etkisini sunun.",
    highlights: ["İlerleme takibi", "ROI raporlama", "Benchmark verileri"],
  },
];

export function HowItWorks() {
  return (
    <div className="w-full py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5">
            <span className="text-sm font-medium text-muted-foreground">Nasıl Çalışır</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center max-w-3xl text-balance text-black">
            Dört basit adımda içgörüden etkiye
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-teal-600">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3 text-black">{step.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

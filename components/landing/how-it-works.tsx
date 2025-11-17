import { CheckCircle2, Activity, TrendingUp, Users, BarChart3 } from 'lucide-react';

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

        {/* Dashboard Mockup - Laptop Frame */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative">
            {/* Laptop Frame */}
            <div className="bg-slate-800 rounded-t-3xl p-6 shadow-2xl">
              {/* Screen Bezel */}
              <div className="bg-slate-900 rounded-t-2xl p-1">
                {/* Screen */}
                <div className="bg-gradient-to-br from-orange-50 to-slate-50 rounded-lg overflow-hidden">
                  {/* Dashboard Content */}
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                          <Activity className="h-6 w-6 text-orange-600" />
                          Acme Corp
                        </h3>
                        <p className="text-sm text-slate-600">Teknoloji • 250 Çalışan</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="px-4 py-2 rounded-lg bg-white shadow-sm border border-slate-200">
                          <div className="text-xs text-slate-600">Katılım Oranı</div>
                          <div className="text-2xl font-bold text-orange-600">87%</div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-white shadow-sm border border-slate-200">
                          <div className="text-xs text-slate-600">Ortalama Skor</div>
                          <div className="text-2xl font-bold text-orange-600">4.2</div>
                        </div>
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <Users className="h-5 w-5 text-slate-600 mb-2" />
                        <div className="text-2xl font-bold text-slate-900">250</div>
                        <div className="text-xs text-slate-600">Çalışan</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
                        <div className="text-2xl font-bold text-green-600">+12%</div>
                        <div className="text-xs text-slate-600">Bu Ay</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <BarChart3 className="h-5 w-5 text-blue-600 mb-2" />
                        <div className="text-2xl font-bold text-slate-900">218</div>
                        <div className="text-xs text-slate-600">Değerlendirme</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <CheckCircle2 className="h-5 w-5 text-orange-600 mb-2" />
                        <div className="text-2xl font-bold text-orange-600">8</div>
                        <div className="text-xs text-slate-600">Boyut</div>
                      </div>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                      <div className="text-sm font-semibold text-slate-900 mb-4">Wellbeing Boyutları</div>
                      <div className="space-y-3">
                        {[
                          { label: "Fiziksel Sağlık", value: 85, color: "bg-blue-500" },
                          { label: "Zihinsel Sağlık", value: 78, color: "bg-purple-500" },
                          { label: "Kariyer", value: 72, color: "bg-green-500" },
                          { label: "Sosyal İlişkiler", value: 88, color: "bg-orange-500" },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 font-medium">{item.label}</span>
                              <span className="text-slate-600">{item.value}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.color} rounded-full transition-all`}
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Laptop Base */}
            <div className="h-3 bg-slate-700 rounded-b-3xl shadow-lg"></div>
            <div className="h-1 bg-slate-600 mx-auto w-2/3 rounded-b-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-600">{step.number}</span>
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
                        <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
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

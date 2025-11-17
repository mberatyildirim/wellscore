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

        {/* Dashboard Mockup - Responsive Frame */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 px-4 sm:px-0">
          <div className="relative group">
            {/* Laptop/Tablet Frame - Hidden on mobile */}
            <div className="hidden sm:block">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl p-4 sm:p-6 shadow-2xl">
                {/* Screen Bezel */}
                <div className="bg-slate-950 rounded-t-2xl p-1">
                  {/* Screen */}
                  <div className="bg-white rounded-lg overflow-hidden">
                    {/* Dashboard Content */}
                    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                            Acme Corp
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600">Teknoloji • 250 Çalışan</p>
                        </div>
                        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                          <div className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm border border-orange-200">
                            <div className="text-xs text-orange-700">Katılım</div>
                            <div className="text-xl sm:text-2xl font-bold text-orange-600">87%</div>
                          </div>
                          <div className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 shadow-sm border border-green-200">
                            <div className="text-xs text-green-700">Skor</div>
                            <div className="text-xl sm:text-2xl font-bold text-green-600">4.2</div>
                          </div>
                        </div>
                      </div>

                      {/* Premium Dimension Cards - NEW DESIGN */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                          { icon: Users, label: "Fiziksel", score: 4.5, gradient: "from-emerald-500 to-green-500", bg: "from-emerald-50 to-green-50", border: "border-green-400/50", text: "text-green-700" },
                          { icon: TrendingUp, label: "Zihinsel", score: 3.8, gradient: "from-yellow-500 to-amber-400", bg: "from-yellow-50 to-amber-50", border: "border-yellow-400/50", text: "text-yellow-700" },
                          { icon: BarChart3, label: "Kariyer", score: 2.9, gradient: "from-orange-500 to-amber-500", bg: "from-orange-50 to-amber-50", border: "border-orange-400/50", text: "text-orange-700" },
                          { icon: CheckCircle2, label: "Sosyal", score: 4.8, gradient: "from-emerald-500 to-green-500", bg: "from-emerald-50 to-green-50", border: "border-green-400/50", text: "text-green-700" },
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          const percentage = (item.score / 5) * 100;
                          return (
                            <div 
                              key={idx} 
                              className={`group/card relative overflow-hidden bg-gradient-to-br ${item.bg} border-2 ${item.border} rounded-xl p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                            >
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/card:opacity-10 transform -skew-x-12 group-hover/card:translate-x-full transition-all duration-1000" />
                              
                              <div className="relative z-10 space-y-2">
                                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.text}`} />
                                <div className={`text-2xl sm:text-3xl font-black ${item.text} tracking-tight`}>
                                  {item.score}
                                </div>
                                <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                                {/* Progress */}
                                <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Chart with Gradient Bars */}
                      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200">
                        <div className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-orange-600" />
                          Tüm Boyutlar
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: "Fiziksel", score: 4.5, gradient: "from-green-400 to-emerald-500" },
                            { label: "Zihinsel", score: 3.8, gradient: "from-yellow-400 to-amber-400" },
                            { label: "Duygusal", score: 4.1, gradient: "from-green-400 to-emerald-500" },
                            { label: "Sosyal", score: 4.8, gradient: "from-green-400 to-emerald-500" },
                            { label: "Kariyer", score: 2.9, gradient: "from-orange-400 to-amber-500" },
                            { label: "Finansal", score: 3.2, gradient: "from-orange-400 to-amber-500" },
                          ].map((item) => {
                            const percentage = (item.score / 5) * 100;
                            return (
                              <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-700 font-semibold">{item.label}</span>
                                  <span className="text-slate-900 font-bold">{item.score}</span>
                                </div>
                                <div className="relative h-2.5 bg-gray-200/50 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-1000 relative overflow-hidden`}
                                    style={{ width: `${percentage}%` }}
                                  >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Laptop Base */}
              <div className="h-2 sm:h-3 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-3xl shadow-lg"></div>
              <div className="h-1 bg-slate-600 mx-auto w-2/3 rounded-b-lg"></div>
            </div>

            {/* Mobile View - Card style */}
            <div className="sm:hidden bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
              <div className="p-4 space-y-4">
                {/* Mobile Header */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-slate-900">Premium Dashboard</h3>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                      <div className="text-xs text-orange-700">Katılım</div>
                      <div className="text-xl font-bold text-orange-600">87%</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200">
                      <div className="text-xs text-green-700">Skor</div>
                      <div className="text-xl font-bold text-green-600">4.2</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Fiziksel", score: 4.5, gradient: "from-green-400 to-emerald-500", bg: "from-emerald-50 to-green-50", border: "border-green-400/50", text: "text-green-700" },
                    { label: "Zihinsel", score: 3.8, gradient: "from-yellow-400 to-amber-400", bg: "from-yellow-50 to-amber-50", border: "border-yellow-400/50", text: "text-yellow-700" },
                    { label: "Kariyer", score: 2.9, gradient: "from-orange-400 to-amber-500", bg: "from-orange-50 to-amber-50", border: "border-orange-400/50", text: "text-orange-700" },
                    { label: "Sosyal", score: 4.8, gradient: "from-green-400 to-emerald-500", bg: "from-emerald-50 to-green-50", border: "border-green-400/50", text: "text-green-700" },
                  ].map((item, idx) => {
                    const percentage = (item.score / 5) * 100;
                    return (
                      <div 
                        key={idx} 
                        className={`bg-gradient-to-br ${item.bg} border-2 ${item.border} rounded-lg p-3 space-y-2`}
                      >
                        <div className={`text-2xl font-black ${item.text}`}>
                          {item.score}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                        <div className="h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${item.gradient} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
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

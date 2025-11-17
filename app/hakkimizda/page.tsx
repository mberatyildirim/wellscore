import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Heart, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-b from-orange-50/50 to-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Daha Sağlıklı İşyerleri İçin{" "}
                <span className="text-orange-600">Güç Veriyoruz</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                WellScore, veri odaklı iyi oluş stratejileriyle organizasyonları 
                daha sağlıklı, mutlu ve verimli işyerleri oluşturmaya yönlendiren 
                yenilikçi bir platformdur.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center rounded-full border border-border bg-orange-50 px-4 py-1.5 mb-4">
                    <span className="text-sm font-medium text-orange-700">Misyonumuz</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    İşyeri İyi Oluşunu Herkes İçin Erişilebilir Kılmak
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Çalışan iyi oluşunun organizasyonel başarının temelini oluşturduğuna inanıyoruz. 
                    Misyonumuz, şirketlere çalışanlarının refahını anlamaları, iyileştirmeleri ve 
                    önceliklendirmeleri için ihtiyaç duydukları araçları sağlamaktır.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Bilimsel olarak doğrulanmış değerlendirmeler, AI destekli içgörüler ve 
                    uygulanabilir öneriler aracılığıyla, iş dünyası liderlerinin daha sağlıklı, 
                    mutlu ve üretken işyerleri yaratmasına olanak tanıyoruz.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-orange-50 rounded-2xl p-6">
                    <Heart className="w-10 h-10 text-orange-600 mb-4" />
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">İyi Oluş Odaklı</h3>
                    <p className="text-sm text-muted-foreground">
                      8 bilimsel wellbeing boyutunu kapsamlı şekilde ölçüyoruz
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <Zap className="w-10 h-10 text-blue-600 mb-4" />
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">AI Destekli</h3>
                    <p className="text-sm text-muted-foreground">
                      Kişiselleştirilmiş öneriler için yapay zeka kullanıyoruz
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <Target className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">Aksiyona Dönük</h3>
                    <p className="text-sm text-muted-foreground">
                      Verileri somut iş sonuçlarına çeviriyoruz
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-6">
                    <Users className="w-10 h-10 text-orange-600 mb-4" />
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">İnsan Odaklı</h3>
                    <p className="text-sm text-muted-foreground">
                      Gizlilik ve anonimlik her zaman önceliğimizdir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="w-full py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Değerlerimiz</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Bizi Yönlendiren İlkeler
                </h2>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Bilimsel Titizlik</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Değerlendirmelerimiz kanıt tabanlı araştırmalara dayanır ve akademik uzmanlarla 
                    işbirliği içinde sürekli olarak geliştirilir. İyi oluş verilerinin doğruluğunu 
                    ve geçerliliğini sağlamak için en yüksek standartları koruyoruz.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Gizlilik ve Güven</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Çalışan gizliliğini savunuyoruz. Tüm veriler anonimleştirilir ve KVKK ile 
                    GDPR uyumludur. Bireysel yanıtlar asla işverenlere maruz bırakılmaz - yalnızca 
                    toplu içgörüler ve trendler paylaşılır.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Sürekli İnovasyon</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    İşyeri iyi oluş dinamik bir alandır. AI, makine öğrenimi ve kullanıcı 
                    geri bildirimlerinden yararlanarak platformumuzu sürekli geliştiriyor ve 
                    organizasyonlara güncel çözümler sunuyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                İşyerinizi Dönüştürmeye Hazır mısınız?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Daha sağlıklı ve mutlu bir işgücünün gücünü keşfedin
              </p>
              <a 
                href="/auth/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                Demo Talep Edin
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


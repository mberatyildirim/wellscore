import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="w-full bg-gradient-to-b from-orange-50/50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Kullanım Koşulları
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Son güncelleme: 17 Kasım 2025
              </p>

              <div className="prose prose-lg max-w-none space-y-8">
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Kabul ve Onay</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    WellScore platformunu ("Hizmet") kullanarak, bu Kullanım Koşullarını ("Koşullar") 
                    okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul ettiğinizi beyan edersiniz. 
                    Bu Koşulları kabul etmiyorsanız, lütfen Hizmeti kullanmayın.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hizmet Tanımı</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    WellScore, organizasyonlara çalışan wellbeing'ini değerlendirmek, analiz etmek ve 
                    iyileştirmek için kapsamlı bir platform sunar. Hizmetlerimiz şunları içerir:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Bilimsel olarak doğrulanmış wellbeing değerlendirmeleri</li>
                    <li>Gerçek zamanlı analitik ve raporlama</li>
                    <li>AI destekli öneriler ve içgörüler</li>
                    <li>İçerik kütüphanesi ve wellbeing kaynakları</li>
                    <li>Hizmet sağlayıcı pazaryeri</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Kullanıcı Hesapları</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">3.1 Hesap Oluşturma</h3>
                      <p className="leading-relaxed">
                        Hizmeti kullanmak için bir hesap oluşturmalısınız. Kayıt sırasında doğru, eksiksiz 
                        ve güncel bilgiler sağlamayı kabul edersiniz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">3.2 Hesap Güvenliği</h3>
                      <p className="leading-relaxed">
                        Hesap kimlik bilgilerinizin gizliliğini korumaktan siz sorumlusunuz. Hesabınızda 
                        gerçekleşen tüm faaliyetlerden sorumlu olduğunuzu kabul edersiniz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">3.3 Hesap Türleri</h3>
                      <p className="leading-relaxed">
                        İki hesap türü vardır: HR Yöneticisi ve Çalışan hesapları. Her hesap türünün 
                        farklı erişim seviyeleri ve sorumlulukları vardır.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Kabul Edilebilir Kullanım</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Hizmeti kullanırken aşağıdakileri yapmamayı kabul edersiniz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Yasaları veya yönetmelikleri ihlal etmek</li>
                    <li>Başka kullanıcıların gizliliğini veya haklarını ihlal etmek</li>
                    <li>Kötü amaçlı yazılım veya zararlı kod yüklemek</li>
                    <li>Platformun güvenlik özelliklerini atlamaya çalışmak</li>
                    <li>Hizmeti tersine mühendislik yapmak veya kopyalamak</li>
                    <li>Otomatik sistemler veya botlar kullanarak veri toplamak</li>
                    <li>Yanıltıcı veya sahte bilgiler sunmak</li>
                    <li>Diğer kullanıcıları taciz etmek veya zarar vermek</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Fikri Mülkiyet</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Hizmet ve içeriği (metin, grafikler, logolar, simgeler, yazılım) WellScore'un 
                    münhasır mülkiyetidir ve telif hakkı, ticari marka ve diğer fikri mülkiyet yasaları 
                    tarafından korunmaktadır. Bu Koşullarda açıkça verilmediği sürece hiçbir hak veya 
                    lisans almanız anlamına gelmez.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Veri Sahipliği ve Kullanımı</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">6.1 Müşteri Verileri</h3>
                      <p className="leading-relaxed">
                        Organizasyonunuzun Hizmete yüklediği verilerin sahibi organizasyonunuzdur. 
                        Verilerinizi işlemek, saklamak ve yönetmek için gerekli hakları bize veriyorsunuz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">6.2 Toplu Veriler</h3>
                      <p className="leading-relaxed">
                        Anonimleştirilmiş ve toplu verileri araştırma, ürün geliştirme ve endüstri 
                        kıyaslamaları için kullanma hakkını saklı tutuyoruz. Bireysel veriler asla 
                        izniniz olmadan paylaşılmaz.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Ücretlendirme ve Ödemeler</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Seçtiğiniz abonelik planına göre ücretlendirilirsiniz. Ödeme koşulları:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Ücretler önceden faturalandırılır (aylık veya yıllık)</li>
                    <li>Tüm ödemeler Türk Lirası cinsinden yapılır</li>
                    <li>Ödenmemiş ücretler hesap askıya alınmasına neden olabilir</li>
                    <li>Geri ödemeler, 14 günlük deneme süresinde iptal etmeniz durumunda geçerlidir</li>
                    <li>Fiyatlar önceden bildirimde bulunarak değiştirilebilir</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Hizmet Seviyesi ve Çalışma Süresi</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Hizmeti 7/24 kullanılabilir tutmak için çaba gösteriyoruz, ancak planlanmış bakım, 
                    güncellemeler veya beklenmeyen teknik sorunlar nedeniyle kesintiler olabileceğini 
                    kabul edersiniz. %99.9 çalışma süresi hedefliyoruz.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Sorumluluk Reddi</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Hizmet "olduğu gibi" ve "mevcut olduğu şekilde" sağlanır. Açık veya zımni hiçbir 
                    garanti vermiyoruz. Özellikle:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Hizmetin kesintisiz veya hatasız olacağını garanti etmiyoruz</li>
                    <li>AI önerileri tavsiye niteliğindedir, profesyonel tıbbi veya yasal tavsiye değildir</li>
                    <li>Üçüncü taraf entegrasyonlarının işlevselliğinden sorumlu değiliz</li>
                    <li>Kullanıcı içeriğinin doğruluğunu veya kalitesini garanti etmiyoruz</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Sorumluluk Sınırlaması</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Yasaların izin verdiği ölçüde, WellScore Hizmet kullanımınızdan kaynaklanan dolaylı, 
                    arızi, özel, sonuç olarak ortaya çıkan veya cezai zararlardan sorumlu olmayacaktır. 
                    Toplam sorumluluğumuz, son 12 ayda ödediğiniz ücretlerle sınırlıdır.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Fesih</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Her iki taraf da aboneliği herhangi bir zamanda feshedebilir:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Hesap ayarlarınızdan aboneliğinizi iptal edebilirsiniz</li>
                    <li>Bu Koşulları ihlal ederseniz hesabınızı askıya alabilir veya sonlandırabiliriz</li>
                    <li>Fesih sonrası verilerinizi 30 gün içinde silebilirsiniz</li>
                    <li>Ödenen ücretler, deneme süresi dışında iade edilmez</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Değişiklikler</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Bu Koşulları zaman zaman güncelleme hakkını saklı tutuyoruz. Önemli değişiklikler 
                    e-posta yoluyla bildirilecektir. Değişikliklerden sonra Hizmeti kullanmaya devam 
                    etmeniz, güncellenmiş Koşulları kabul ettiğiniz anlamına gelir.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Uygulanacak Hukuk</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Bu Koşullar, Türkiye Cumhuriyeti yasalarına tabi olacak ve bunlara göre yorumlanacaktır. 
                    Bu Koşullardan kaynaklanan herhangi bir anlaşmazlık, İstanbul mahkemelerinin münhasır 
                    yargı yetkisine tabi olacaktır.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. İletişim</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Bu Kullanım Koşulları hakkında sorularınız varsa, lütfen bizimle iletişime geçin:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-gray-900">E-posta:</strong> legal@wellscore.co</p>
                    <p><strong className="text-gray-900">Adres:</strong> [Şirket Adresi]</p>
                    <p><strong className="text-gray-900">Telefon:</strong> [İletişim Numarası]</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


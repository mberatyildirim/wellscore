import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="w-full bg-gradient-to-b from-orange-50/50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Gizlilik Politikası
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Son güncelleme: 17 Kasım 2025
              </p>

              <div className="prose prose-lg max-w-none space-y-8">
                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Giriş</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    WellScore olarak, kullanıcılarımızın gizliliğini korumayı en önemli önceliğimiz olarak görüyoruz. 
                    Bu Gizlilik Politikası, kişisel verilerinizi nasıl topladığımızı, kullandığımızı, 
                    sakladığımızı ve koruduğumuzu açıklar. Hizmetlerimizi kullanarak, bu politikada açıklanan 
                    uygulamaları kabul etmiş olursunuz.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Topladığımız Bilgiler</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Hesap Bilgileri</h3>
                      <p className="leading-relaxed">
                        İsim, e-posta adresi, şirket bilgileri ve iletişim bilgileri gibi kayıt sırasında 
                        sağladığınız temel bilgileri topluyoruz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">2.2 Anket Verileri</h3>
                      <p className="leading-relaxed">
                        Wellbeing değerlendirmelerindeki yanıtlarınız anonimleştirilir ve yalnızca toplu 
                        analizler için kullanılır. Bireysel yanıtlar işverenlere asla açıklanmaz.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">2.3 Kullanım Verileri</h3>
                      <p className="leading-relaxed">
                        Platform etkileşimleriniz, oturum süreleri ve özellik kullanımı gibi otomatik olarak 
                        toplanan teknik bilgileri kullanıcı deneyimini iyileştirmek için kaydediyoruz.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Verileri Nasıl Kullanırız</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Hizmetlerimizi sağlamak ve sürdürmek</li>
                    <li>Toplu wellbeing içgörüleri ve raporları oluşturmak</li>
                    <li>Platformumuzu geliştirmek ve kişiselleştirmek</li>
                    <li>AI destekli öneriler sunmak</li>
                    <li>Teknik destek sağlamak</li>
                    <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Veri Güvenliği</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Tüm veri aktarımları için SSL/TLS şifreleme</li>
                    <li>Hassas bilgiler için veritabanı şifrelemesi</li>
                    <li>Düzenli güvenlik denetimleri ve penetrasyon testleri</li>
                    <li>Rol tabanlı erişim kontrolleri</li>
                    <li>Düzenli veri yedekleri</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. KVKK ve GDPR Uyumluluğu</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    WellScore, Türkiye'nin Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği'nin 
                    Genel Veri Koruma Yönetmeliği (GDPR) gerekliliklerine tam uyum sağlar. Kullanıcılarımız 
                    aşağıdaki haklara sahiptir:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Kişisel verilerinize erişim hakkı</li>
                    <li>Yanlış verileri düzeltme hakkı</li>
                    <li>Verilerin silinmesini talep etme hakkı (unutulma hakkı)</li>
                    <li>Veri işleme faaliyetlerine itiraz etme hakkı</li>
                    <li>Veri taşınabilirliği hakkı</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Veri Saklama</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kişisel verilerinizi yalnızca hizmet sağlama amacıyla veya yasal gerekliliklere uymak 
                    için gerekli olduğu sürece saklarız. Hesabınızı kapattığınızda, verileriniz yasal 
                    saklama gerekliliklerine tabi olmadığı sürece 30 gün içinde güvenli bir şekilde silinir.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Üçüncü Taraf Paylaşımı</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Kişisel verilerinizi üçüncü taraflarla satmayız veya kiralamayız. Yalnızca aşağıdaki 
                    durumlarda güvenilir hizmet sağlayıcılarla paylaşabiliriz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Bulut altyapı ve barındırma hizmetleri (Vercel, Supabase)</li>
                    <li>Analitik ve performans izleme</li>
                    <li>Ödeme işleme (gelecekte eklenecek)</li>
                    <li>Yasal yükümlülükler</li>
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Çerezler ve İzleme Teknolojileri</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kullanıcı deneyimini iyileştirmek için çerezler ve benzeri izleme teknolojilerini kullanıyoruz. 
                    Tarayıcı ayarlarınızdan çerezleri kontrol edebilir veya devre dışı bırakabilirsiniz, ancak 
                    bu bazı platform özelliklerinin işlevselliğini etkileyebilir.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Politika Güncellemeleri</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması 
                    durumunda sizi e-posta yoluyla bilgilendireceğiz. Güncellenmiş politikanın yayınlanma 
                    tarihi bu sayfanın üst kısmında belirtilecektir.
                  </p>
                </section>

                <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. İletişim</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Gizlilik politikamız veya veri uygulamalarımız hakkında sorularınız varsa, lütfen 
                    bizimle iletişime geçin:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-gray-900">E-posta:</strong> privacy@wellscore.com</p>
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


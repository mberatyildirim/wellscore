import Link from "next/link";
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-teal-600" />
              <span className="font-bold text-xl">WellScore</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Veri odaklı iyi oluş stratejileriyle organizasyonları daha sağlıklı ve mutlu işyerleri oluşturmaya güçlendiriyoruz.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Ürün</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Özellikler</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Entegrasyonlar</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pazaryeri</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Kaynaklar</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Dokümantasyon</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Araştırma</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Vaka Çalışmaları</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Şirket</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">İletişim</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Kullanım Koşulları</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 WellScore. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

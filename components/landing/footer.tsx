import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.svg" 
                alt="WellScore Logo" 
                width={28} 
                height={28}
                className="w-7 h-7"
              />
              <span className="font-bold text-xl text-gray-900">WellScore</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Veri odaklı iyi oluş stratejileriyle organizasyonları daha sağlıklı ve mutlu işyerleri oluşturmaya güçlendiriyoruz.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/hakkimizda" className="text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</Link>
            <Link href="/iletisim" className="text-muted-foreground hover:text-foreground transition-colors">İletişim</Link>
            <Link href="/gizlilik" className="text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="text-muted-foreground hover:text-foreground transition-colors">Kullanım Koşulları</Link>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex justify-center items-center">
          <p className="text-sm text-slate-600">
            © 2025 <span className="font-semibold text-slate-900">WellScore</span>. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

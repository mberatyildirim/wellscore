import { Button } from "@/components/ui/button";
import { MoveRight, Calendar } from 'lucide-react';
import Link from "next/link";

export function CTASection() {
  return (
    <div className="w-full py-24 bg-gradient-to-br from-teal-600 to-teal-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
            İşyeri iyi oluşunuzu dönüştürmeye hazır mısınız?
          </h2>
          <p className="text-lg text-white/90 text-balance">
            Daha sağlıklı, mutlu ve verimli işyerleri yaratmak için WellScore kullanan yüzlerce organizasyona katılın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="gap-4 bg-white text-teal-700 hover:bg-white/90 font-semibold shadow-lg" asChild>
              <Link href="/auth/sign-up">
                Ücretsiz deneyin <MoveRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border-2 border-white font-semibold backdrop-blur-sm" 
              asChild
            >
              <Link href="/contact">
                <Calendar className="w-5 h-5" />
                Demo Talep Edin
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/70 mt-4">
            Kredi kartı gerektirmez · 14 günlük ücretsiz deneme · İstediğiniz zaman iptal edin
          </p>
        </div>
      </div>
    </div>
  );
}

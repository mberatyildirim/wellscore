import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "WellScore, çalışan iyi oluşuna yaklaşımımızı kökten değiştirdi. AI önerileri inanılmaz derecede doğru ve uygulanabilir. Sadece 6 ayda genel iyi oluş skorlarında %34 iyileşme gördük.",
    author: "Ayşe Yılmaz",
    role: "İnsan Kaynakları Direktörü",
    company: "Sabancı Holding",
    rating: 5,
  },
  {
    quote: "Analitik gösterge paneli bize daha önce hiç sahip olmadığımız içgörüler veriyor. Departmana göre segmentasyon yapabilmek ve trendleri takip edebilmek, iyi oluş stratejimiz için paha biçilmez.",
    author: "Mehmet Kaya",
    role: "İK Müdürü",
    company: "Koç Holding",
    rating: 5,
  },
  {
    quote: "Kurulum inanılmaz derecede sorunsuzdu ve çalışanlarımız arayüzü çok beğendi. Kişiselleştirilmiş öneriler, diğer platformlarda hiç görmediğimiz seviyelerde katılım sağladı.",
    author: "Zeynep Demir",
    role: "İnsan ve Kültür Başkanı",
    company: "Arçelik",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <div className="w-full py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5">
            <span className="text-sm font-medium text-muted-foreground">Referanslar</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center max-w-3xl text-balance text-black">
            Dünya çapında İK ekiplerinin tercihi
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl text-balance">
            Önde gelen organizasyonların WellScore ile işyeri kültürlerini nasıl dönüştürdüklerini görün.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="border-border">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-black">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

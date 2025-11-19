"use client";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  // State to manage form data and submission status
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes by updating state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set submitting status to show loading state

    // Simulate form submission (in production, this would send to an API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Show success message to user
      toast.success("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
      
      // Reset form fields after successful submission
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      // Show error message if submission fails
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false); // Reset submitting status
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-b from-orange-50/50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bize Ulaşın
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Sorularınız mı var? WellScore ekibi size yardımcı olmak için burada. 
                İletişime geçmekten çekinmeyin!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    İletişim Bilgileri
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Aşağıdaki kanallardan bizimle iletişime geçebilir veya formu doldurarak 
                    mesaj gönderebilirsiniz. Size en kısa sürede geri dönüş yapacağız.
                  </p>

                  <div className="space-y-6">
                    {/* Email Contact */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                        <p className="text-muted-foreground">info@wellscore.co</p>
                        <p className="text-muted-foreground">support@wellscore.co</p>
                      </div>
                    </div>

                    {/* Phone Contact */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                        <p className="text-muted-foreground">+90 (212) 123 45 67</p>
                        <p className="text-sm text-muted-foreground">Pazartesi - Cuma, 09:00 - 18:00</p>
                      </div>
                    </div>

                    {/* Office Address */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                        <p className="text-muted-foreground">
                          Maslak Mah. Büyükdere Cad.<br />
                          No: 123, Kat: 5<br />
                          Sarıyer, İstanbul 34398
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Çalışma Saatleri</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Pazartesi - Cuma</span>
                        <span className="font-medium text-gray-900">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cumartesi</span>
                        <span className="font-medium text-gray-900">10:00 - 16:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pazar</span>
                        <span className="font-medium text-gray-900">Kapalı</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-slate-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Mesaj Gönderin
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        placeholder="ornek@email.com"
                      />
                    </div>

                    {/* Company Input */}
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                        Şirket
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        placeholder="Şirket adınız"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                        placeholder="+90 (5XX) XXX XX XX"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors resize-none"
                        placeholder="Size nasıl yardımcı olabiliriz?"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
                    >
                      {isSubmitting ? (
                        "Gönderiliyor..."
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Mesaj Gönder
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      * İşaretli alanlar zorunludur
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section (Optional - Placeholder) */}
        <div className="w-full py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Ofisimize Uğrayın
              </h2>
              <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Harita Entegrasyonu (Google Maps / OpenStreetMap)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


"use client";

// HR Signup Page - Company Registration
// Creates company + HR admin account
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingScreen } from "@/components/ui/loading-screen";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Lock, User, Briefcase, Users } from "lucide-react";
import { toast } from "sonner";

export default function HRSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Company info
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  
  // HR Admin info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Şifre en az 6 karakter olmalı!");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      // Step 1: Create auth user (HR Admin)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'hr_admin',
          },
        },
      });

      if (authError) throw new Error("Hesap oluşturulamadı: " + authError.message);
      if (!authData.user) throw new Error("Kullanıcı oluşturulamadı");

      const userId = authData.user.id;

      // Step 2: Create company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: companyName,
          industry,
          employee_count: parseInt(employeeCount) || null,
          subscription_plan: 'trial',
        })
        .select()
        .single();

      if (companyError) throw new Error("Şirket kaydı oluşturulamadı: " + companyError.message);
      if (!companyData) throw new Error("Şirket verisi alınamadı");

      const companyId = companyData.id;

      // Step 3: Create HR admin profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          company_id: companyId,
          role: 'hr_admin',
          full_name: fullName,
          email,
          is_active: true,
        });

      if (profileError) throw new Error("Profil oluşturulamadı: " + profileError.message);

      // Success!
      toast.success("Şirket kaydı başarılı! 🎉");
      toast.info("Email adresinizi doğrulayın");
      
      // Redirect to success page (hard redirect for production)
      window.location.href = "/auth/sign-up-success";
      
    } catch (error: any) {
      console.error("[HR Signup Error]:", error);
      toast.error(error.message || "Kayıt sırasında hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingScreen />
      <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Ana Sayfaya Dön</span>
          <span className="sm:hidden">Geri</span>
        </Link>

        <Card className="border-border bg-white shadow-xl">
          <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
              Şirket Kaydı
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 mt-2">
              Wellscore'a hoş geldiniz! Şirketinizi kaydedin ve çalışanlarınızın wellbeing'ini ölçmeye başlayın.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  Şirket Bilgileri
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700">Şirket Adı *</Label>
                  <Input
                    id="companyName"
                    placeholder="Örnek: Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-gray-700">Sektör</Label>
                    <Select value={industry} onValueChange={setIndustry} disabled={isLoading}>
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                        <SelectValue placeholder="Sektör seçin" className="text-gray-900 placeholder:text-gray-900" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-900">
                        <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                        <SelectItem value="Finans">Finans</SelectItem>
                        <SelectItem value="Sağlık">Sağlık</SelectItem>
                        <SelectItem value="Eğitim">Eğitim</SelectItem>
                        <SelectItem value="Perakende">Perakende</SelectItem>
                        <SelectItem value="Üretim">Üretim</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount" className="text-gray-700">Çalışan Sayısı</Label>
                    <Select value={employeeCount} onValueChange={setEmployeeCount} disabled={isLoading}>
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                        <SelectValue placeholder="Seçin" className="text-gray-900 placeholder:text-gray-900" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-900">
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* HR Admin Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  Yönetici Bilgileri
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700">Ad Soyad *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      className="pl-9 text-gray-900"
                      placeholder="Adınız Soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9 text-gray-900"
                      placeholder="hr@sirket.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Şifre *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-9 text-gray-900"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700">Şifre Tekrar *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-9 text-gray-900"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-600 text-white hover:bg-orange-700 h-12"
                disabled={isLoading}
              >
                {isLoading ? "Kaydediliyor..." : "Şirketi Kaydet ve Başla"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/auth/login"
                  className="text-orange-600 underline underline-offset-4 hover:text-orange-700"
                >
                  Giriş Yapın
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
}

